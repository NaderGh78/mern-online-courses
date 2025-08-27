const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const {
    PlaylistModel,
    validateNewPlayList,
    validateUpdatePlayList } = require("../models/PlaylistModel");
const { UserModel } = require("../models/UserModel");
const { CourseModel } = require("../models/CourseModel");
const { CommentModel } = require("../models/CommentModel");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");
const fs = require("fs");

/*===========================================*/
/*===========================================*/
/*===========================================*/

/**
 * @desc create new playlist
 * @route /api/playlists
 * @method Post
 * @access private(only theacher himself) 
*/

const createPlaylistCtrl = asyncHandler(

    async (req, res) => {

        const { error } = validateNewPlayList(req.body);

        if (error) {

            return res.status(400).json({ message: error.details[0].message });

        }

        const { title, description, category } = req.body;

        // Check if title already exists
        const exists = await PlaylistModel.findOne({ title });

        if (exists) {

            return res.status(400).json({ message: "Playlist title must be unique" });

        }

        // Set default playlist image
        let playlistImage = { 
            url: "https://backend-oeap.onrender.com/uploads/no-picture.jpg",
            publicId: null
        };

        // If an image was uploaded, upload it to Cloudinary
        if (req.file) {

            try {

                const result = await cloudinaryUploadImage(req.file.path);

                playlistImage = {

                    url: result.secure_url,

                    publicId: result.public_id,

                };

            } catch (error) {

                console.error("Error uploading to Cloudinary:", error);

            } finally {

                fs.unlinkSync(req.file.path);

            }

        }

        // Create new playlist document
        const newPlaylist = new PlaylistModel({
            title,
            description,
            category,
            mainPlaylistImage: playlistImage,
            teacher: req.userDecoded.id,
            teacherName: req.userDecoded.username,
        });

        // Save it to the database
        await newPlaylist.save();

        await UserModel.findByIdAndUpdate(req.userDecoded.id, {

            $push: { createdPlaylists: newPlaylist._id } // Push playlist ID to teacher's createdPlaylists

        });

        // Send success response
        res.status(201).json({
            message: "Playlist created successfully",
            data: newPlaylist,
            success: true,
        });

    }

);

/*=========================================*/

/**
 * @desc get all playlists
 * @route /api/playlists
 * @method Get
 * @access public
*/

const getAllPlaylistsCtrl = asyncHandler(

    async (req, res) => {

        const playlists = await PlaylistModel.find()
            .populate("teacher", "username profilePhoto")
            .populate("courses")
            .lean();


        const playlistsWithCounts = playlists.map(playlist => ({
            ...playlist,
            coursesCount: playlist.courses.length,
            approvedCoursesCount: playlist.courses.filter(
                c => c.isCourseApproved === "approved"
            ).length
        }));

        res.status(200).json({
            playlists: playlistsWithCounts,
            playListCount: playlists.length,
        });

    }
);

/*=========================================*/

/**
 * @desc get single playlist
 * @route /api/playlists/id
 * @method Get
 * @access public
*/

const getSinglePlaylistCtrl = asyncHandler(

    async (req, res) => {

        const playlist = await PlaylistModel.findById(req.params.id)
            .populate("teacher", "username email profilePhoto createdPlaylists createdAt")
            .populate("courses", "videoTitle tutorialImage createdAt");


        // const playlist = await PlaylistModel.findById(req.params.id).populate("teacher");

        if (playlist) {

            res.status(200).json(playlist);

        } else {

            return res.status(400).json({ message: "No playlist exists!" });

        }

    }

);

/*=========================================*/

/**
 * @desc update single playlist
 * @route /api/playlists/id
 * @method Put
 * @access private(only theacher himself) 
*/

const updatePlaylistCtrl = asyncHandler(

    async (req, res) => {

        const { error } = validateUpdatePlayList(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const playlist = await PlaylistModel.findById(req.params.id);

        if (!playlist) {

            return res.status(404).json({ message: "Playlist doesn't exist!" });

        }

        if (req.file) {

            try {

                // Step 1: Upload the new image to Cloudinary
                const uploadedImage = await cloudinaryUploadImage(req.file.path);

                // Step 2: Delete the old image from Cloudinary (if it exists)
                if (playlist.mainPlaylistImage && playlist.mainPlaylistImage.publicId) {

                    console.log("Deleting old image with publicId:", playlist.mainPlaylistImage.publicId);

                    await cloudinaryRemoveImage(playlist.mainPlaylistImage.publicId); // Delete old image

                }

                // Step 3: Update the playlist with the new image details
                playlist.mainPlaylistImage = {

                    url: uploadedImage.secure_url,

                    publicId: uploadedImage.public_id,

                };

            } catch (error) {

                console.error("Error updating image from Cloudinary:", error);

                return res.status(500).json({ message: "Failed to update image." });

            } finally {

                fs.unlinkSync(req.file.path);

            }

        }

        playlist.title = req.body.title || playlist.title;

        playlist.description = req.body.description || playlist.description;

        playlist.category = req.body.category || playlist.category;

        await playlist.save();

        res.status(200).json({
            message: "Playlist updated successfully!",
            data: playlist
        });

    }

);

/*=========================================*/

/**
 * @desc get all playlist for teacher
 * @route /api/playlists/teacher/:teacherId
 * @method Get
 * @access public
*/

const getAllPlaylistsForTeacherCtrl = asyncHandler(

    async (req, res) => {

        try {
            const teacherId = req.params.teacherId;

            const playlists = await PlaylistModel.find({ teacher: teacherId })
                .populate("teacher", "username profilePhoto")
                .populate("courses");

            if (playlists.length === 0) {

                return res.status(200).json({ message: "No playlists found for this teacher." });

            }

            const coursesCount = playlists.reduce((total, playlist) => {
                return total + playlist.courses.length;
            }, 0);

            res.status(200).json({ coursesCount, playlists });

        } catch (error) {

            res.status(500).json({ message: error.message });

        }

    }

);

/*=========================================*/

/**
 * @desc get all courses from playlist
 * @route /api/playlists/:playlistId/courses
 * @method Get
 * @access public
*/

const getAllCoursesFromPlaylistCtrl = asyncHandler(

    async (req, res) => {

        const { playlistId } = req.params;

        try {

            // Find the playlist
            const playlist = await PlaylistModel.findOne({
                _id: playlistId, // Only filter by playlistId
            }).populate({
                path: "courses",
                populate: { path: "playlist", select: "title" },
            });

            if (!playlist) {

                return res.status(404).json({ message: "Playlist doesn't exist!" });

            }

            if (playlist.courses.length === 0) {

                return res.status(200).json({ message: "No courses found for this playlist." });

            }

            res.status(200).json(playlist.courses);

        } catch (error) {

            console.error("Error in getAllCoursesForPlaylistCtrl:", error);

            res.status(500).json({ message: "Internal server error" });

        }

    }

);

/*=========================================*/

/**
 * @desc delete single playlist with all teacher courses
 * @route /api/playlists/playlistId/teacherId  
 * @method Delete
 * @access private(only theacher himself) 
*/

const deletePlaylistCtrl = asyncHandler(

    async (req, res) => {

        const { playlistId, teacherId } = req.params;

        const playlist = await PlaylistModel.findById(playlistId);

        if (!playlist) return res.status(400).json({ message: "Playlist doesn't exist!" });

        if (playlist.teacher.toString() !== teacherId.toString()) {

            return res.status(403).json({ message: "You can't delete this playlist!" });

        }

        const courseIds = playlist.courses.map(id => new mongoose.Types.ObjectId(id));

        // 1. Delete all courses in playlist
        await CourseModel.deleteMany({ _id: { $in: courseIds } });

        // 2. Delete all comments related to these courses
        await CommentModel.deleteMany({ courseId: { $in: courseIds } });

        // 3. Remove playlist itself
        await PlaylistModel.findByIdAndDelete(playlistId);

        // 4. Remove playlist from teacher's createdPlaylists
        await UserModel.findByIdAndUpdate(
            teacherId,
            { $pull: { createdPlaylists: playlistId } }
        );

        // 5. Remove these courses from all users' courses array
        await UserModel.updateMany(
            { courses: { $in: courseIds } },
            { $pull: { courses: { $in: courseIds } } }
        );

        res.status(200).json({ message: "Playlist and its courses deleted successfully!" });
    });

/*=========================================*/

/** 
 * @desc search for a playlist by title name
 * @route api/playlists/searchPlaylist
 * @method Get
 * @access public 
*/

const searchPlaylistCtrl = asyncHandler(

    async (req, res) => {

        const query = req.query.q || "";

        if (!query.trim()) {
            return res.status(400).json({ data: [], message: "Search for something!" });
        }

        try {
            const playlists = await PlaylistModel.find({
                title: { $regex: query, $options: 'i' },
                isPlaylistApproved: "approved"  // just for approved playlist
            })
                .populate('teacher', 'username profilePhoto')
                .populate('courses', '_id isCourseApproved')
                .lean();

            console.log(playlists)


            if (playlists.length === 0) {
                return res.status(200).json({ data: [], message: "No playlist found" });
            }

            const playlistsWithCount = playlists.map(p => ({
                ...p,
                approvedCoursesCount: (p.courses || []).filter(c => c.isCourseApproved === "approved").length
            }));

            res.status(200).json({ data: playlistsWithCount });

        } catch (error) {

            res.status(500).json({ message: error.message });

        }

    });

/*=========================================*/

/**
 * @desc approved playlist by admin
 * @route api/playlists/approve-playlist/:playlistId
 * @method Post
 * @access private(only admin) 
 */

const approvePlaylistByAdminCtrl = asyncHandler(

    async (req, res) => {

        // get playlist id form req
        const { playlistId } = req.params;

        // validation
        const { error } = validateUpdatePlayList(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // get the playlist with given id
        const playlist = await PlaylistModel.findById(playlistId);

        // check if the playlist exists and return error msg
        if (!playlist) {

            return res.status(404).json({ message: "Playlist doesn't exist!" });

        }

        // check if the new status is same as current
        if (req.body.isPlaylistApproved && playlist.isPlaylistApproved === req.body.isPlaylistApproved) {

            return res.status(400).json({ message: `Playlist is already '${req.body.isPlaylistApproved}'` });

        }

        // Update playlist
        const updatedPlaylist = await PlaylistModel.findByIdAndUpdate(
            playlistId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Playlist updated by admin",
            updatedPlaylist
        });

    }

);

/*=========================================*/

module.exports = {
    createPlaylistCtrl,
    getAllPlaylistsCtrl,
    getSinglePlaylistCtrl,
    updatePlaylistCtrl,
    getAllPlaylistsForTeacherCtrl,
    getAllCoursesFromPlaylistCtrl,
    deletePlaylistCtrl,
    searchPlaylistCtrl,
    approvePlaylistByAdminCtrl
};