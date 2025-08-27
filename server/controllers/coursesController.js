const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { PlaylistModel } = require("../models/PlaylistModel");
const { CourseModel, validateUpdateStatus } = require("../models/CourseModel");
const { UserModel } = require("../models/UserModel");
const { CommentModel } = require("../models/CommentModel");
const { validateCourse } = require("../models/CourseModel");
const { cloudinaryUploadImage } = require("../utils/cloudinary");
const fs = require("fs");

/*=========================================*/
/*=========================================*/
/*=========================================*/

/**
 *@desc create course
 *@route /api/courses/:playlistId
 *@method Post
 *@access private(only theacher himself)
*/

const createCourseCtrl = asyncHandler(

  async (req, res) => {

    const playlistId = req.params.playlistId;

    // 1. Check if the playlist exists
    const playlist = await PlaylistModel.findById(playlistId);

    if (!playlist) {

      return res.status(404).json({ message: "Playlist not found" });

    }

    // 2. Check if the user is the teacher of the playlist
    if (playlist.teacher.toString() !== req.userDecoded.id) {

      return res.status(403).json({ message: "Not authorized to add course to this playlist" });

    }

    // 3. Validate video link - Make sure it’s a valid URL
    const videoLinkRegex = /^https?:\/\/.+\..+/;

    if (!videoLinkRegex.test(req.body.videoLink)) {

      return res.status(400).json({ message: "Invalid video link URL" });

    }

    // 4. Validate course data
    const courseData = {

      videoTitle: req.body.videoTitle,

      videoLink: req.body.videoLink,

      description: req.body.description

    };

    const { error } = validateCourse(courseData);

    if (error) {

      return res.status(400).json({ message: error.details[0].message });

    }

    // 5. Check if the course title already exists in the playlist
    const existingCourse = await CourseModel.findOne({
      videoTitle: req.body.videoTitle,
      playlist: playlistId
    });

    if (existingCourse) { 

      return res.status(400).json({ message: "Video title already exists!" });

    }

    // 6. Handle image upload (Cloudinary)
    let tutorialImage = {
      // url: `${process.env.BACKEND_URL}/uploads/no-picture.jpg`,
      url: "https://backend-online-courses-7xl5.onrender.com/uploads/no-picture.jpg",
      publicId: null
    };

    if (req.file) {

      // console.log('File Upload:', req.file);

      const uploaded = await cloudinaryUploadImage(req.file.path);

      fs.unlinkSync(req.file.path);

      tutorialImage = {
        url: uploaded.secure_url,
        publicId: uploaded.public_id
      };

    }

    // 7. Create the new course
    const newCourse = await CourseModel.create({
      playlist: playlistId,
      videoTitle: req.body.videoTitle,
      videoLink: req.body.videoLink,
      description: req.body.description,
      tutorialImage,
      teacher: req.userDecoded.id
    });

    // add the new course to user
    await UserModel.findByIdAndUpdate(
      req.userDecoded.id,
      { $push: { courses: newCourse._id } }
    );

    // 8. Update the playlist's courses array
    await PlaylistModel.findByIdAndUpdate(
      playlistId,
      { $push: { courses: newCourse._id } },
      { new: true } // Return the updated playlist
    );

    // 9. Send success response
    res.status(201).json({
      message: "Course created successfully",
      data: newCourse,
      success: true,
    });
  }
);

/*=========================================*/

/**
 *@desc get all courses
 *@route /api/courses/:playlistId
 *@method Get
 *@access public 
*/

const getAllCoursesCtrl = asyncHandler(

  async (req, res) => {

    const playlist = await PlaylistModel.findOne({

      _id: req.params.playlistId, // Only filter by playlistId

    }).populate({
      path: "courses",
      populate: {
        path: "playlist",
        select: "title"
      },
    }).populate('comment');

    if (!playlist) {

      return res.status(404).json({ message: "Playlist doesn't exist!" });

    }

    res.status(200).json(playlist.courses);

  });

/*=========================================*/

/**
 *@desc get single course
 *@route /api/courses/:playlistId/:courseId
 *@method Get
 *@access public 
*/

const getSingleCourseCtrl = asyncHandler(

  async (req, res) => {

    const { playlistId, courseId } = req.params;

    try {

      // 1. Fetch the course by courseId and playlistId
      const course = await CourseModel.findOne({
        _id: courseId,
        playlist: playlistId,
      }).populate('teacher', 'username profilePhoto role')
        .populate('comment')
        .populate('playlist', 'title');

      if (!course) {

        return res.status(404).json({ message: "Course not found!" });

      }

      // 2. Check if teacher details are populated correctly
      if (!course.teacher) {

        return res.status(404).json({ message: "Teacher not found for this course!" });

      }

      // 3. Send the populated course with teacher details
      res.status(200).json(course);

    } catch (error) {

      console.error("Error in getSingleCourseCtrl:", error);

      res.status(500).json({ message: "Internal server error", error: error.message });

    }

  }

);

/*=========================================*/

/**
 *@desc edit course
 *@route /api/courses/:playlistId/:courseId
 *@method Put
 *@access private(only theacher himself) 
*/

const editCourseCtrl = asyncHandler(

  async (req, res) => {

    const { playlistId, courseId } = req.params;

    const { videoTitle, videoLink, description, playlist: newPlaylistId } = req.body;

    try {

      // Find the course
      const course = await CourseModel.findOne({
        _id: courseId,
        playlist: playlistId // Ensure the course belongs to the original playlist
      });

      if (!course) {

        return res.status(404).json({ message: "Course not found in this playlist!" });

      }

      // Update the course fields
      if (videoTitle) course.videoTitle = videoTitle;

      if (videoLink) course.videoLink = videoLink;

      if (description) course.description = description;

      // Handle playlist change
      if (newPlaylistId && newPlaylistId !== course.playlist.toString()) {

        // Remove the course from the previous playlist
        await PlaylistModel.findByIdAndUpdate(
          playlistId,
          { $pull: { courses: courseId } }, // Remove course from previous playlist
          { new: true }
        );

        // Add the course to the new playlist
        await PlaylistModel.findByIdAndUpdate(
          newPlaylistId,
          { $addToSet: { courses: courseId } }, // Add course to new playlist
          { new: true }
        );

        // Update the course's playlist field
        course.playlist = newPlaylistId;

      }

      // Handle image upload if a new image is provided
      if (req.file) {

        const uploadedImage = await cloudinaryUploadImage(req.file.path);

        fs.unlinkSync(req.file.path);

        // Update the tutorialImage field
        course.tutorialImage = {

          url: uploadedImage.secure_url,

          publicId: uploadedImage.public_id

        };

      }

      // Save the updated course
      const updatedCourse = await course.save();

      // Send success response
      res.status(200).json({
        message: "Course updated successfully!",
        data: updatedCourse,
      });

    } catch (error) {

      res.status(500).json({ message: "Internal server error", error: error.message });

    }

  }

);

/*=========================================*/

/**
 *@desc delete single course
 *@route /api/courses/:playlistId/:courseId
 *@method Delete
 *@access private(only theacher himself) 
*/

const deleteSingleCourseCtrl = asyncHandler(async (req, res) => {
  const { playlistId, courseId } = req.params;

  const objectCourseId = new mongoose.Types.ObjectId(courseId);

  // 1. Check if course exists
  const course = await CourseModel.findOne({ _id: objectCourseId, playlist: playlistId });
  if (!course) return res.status(404).json({ message: "Course not found" });

  // 2. Delete course
  await CourseModel.findByIdAndDelete(objectCourseId);

  // 3. Remove course from playlist
  await PlaylistModel.findByIdAndUpdate(
    playlistId,
    { $pull: { courses: objectCourseId } },
    { new: true }
  );

  // 4. Remove course from all users
  await UserModel.updateMany(
    { courses: objectCourseId },
    { $pull: { courses: objectCourseId } }
  );

  // 5. Delete related comments
  await CommentModel.deleteMany({ courseId: objectCourseId });

  res.status(200).json({ message: "Course deleted successfully" });
});

/*=========================================*/

/**
 *@desc make like on video
 *@route /api/courses/:courseId/like
 *@method Post
 *@access private(only login user) 
*/

const addLikeOnCourseCtrl = asyncHandler(

  async (req, res) => {

    const { courseId } = req.params;

    const userId = req.userDecoded.id;

    const course = await CourseModel.findById(courseId);

    if (!course) {

      return res.status(400).json({ message: "This course doesn't exist!" });

    }

    const alreadyLiked = course.likes.includes(userId);

    if (alreadyLiked) {

      course.likes.pull(userId);

    } else {

      course.likes.push(userId);

    }

    await course.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Like added",
      likes: course.likes
    });

  }

);

/*=========================================*/

/**
 * @desc approved course by admin
 * @route api/courses/approve-course/:courseId
 * @method Post
 * @access private(only admin) 
 */

const approveCourseByAdminCtrl = asyncHandler(

  async (req, res) => {

    const { courseId } = req.params;

    const { isCourseApproved } = req.body;

    // validation
    const { error } = validateUpdateStatus(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const course = await CourseModel.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course doesn't exist!" });

    // check if the new status is same as current
    if (req.body.isCourseApproved && isCourseApproved.isCourseApproved === req.body.isCourseApproved) {

      return res.status(400).json({ message: `Course is already '${req.body.isCourseApproved}'` });

    }

    // Update course
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Course updated by admin",
      updatedCourse
    });

  }

);

/*=========================================*/

module.exports = {
  createCourseCtrl,
  getAllCoursesCtrl,
  getSingleCourseCtrl,
  editCourseCtrl,
  deleteSingleCourseCtrl,
  addLikeOnCourseCtrl,
  approveCourseByAdminCtrl

}; 
