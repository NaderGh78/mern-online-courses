const asynHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const { UserModel, validateUpdateUser } = require("../models/UserModel");
const { PlaylistModel } = require("../models/PlaylistModel");
const { CourseModel } = require("../models/CourseModel");
const { CommentModel } = require("../models/CommentModel");
const path = require("path");
const fs = require("fs");
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary");

/*===========================================*/
/*===========================================*/
/*===========================================*/

/** 
 * @desc get all users 
 * @route api/users/profile
 * @method Get
 * @access public
*/

const getAllUsersCtrl = asynHandler(

    async (req, res) => {

        const users = await UserModel.find();

        res.status(200).json({
            "userCount": users.length,
            users,
        });

    }

);

/*===========================================*/

/**
 * @desc get user
 * @route api/users/profile/:id
 * @method Get
 * @access public
*/

const getUserCtrl = asynHandler(

    async (req, res) => {

        try {

            const user = await UserModel.findById(req.params.id);

            if (!user) {

                return res.status(404).json({ message: "user dont found!" });

            }

            res.status(200).json(user);

        } catch (error) {

            return res.status(500).json({

                message: "Something went wrong while fetching user.",

                error: error.message

            });

        }

    }

);

/*===========================================*/

/**
 * @desc update profile user
 * @route api/users/profile/:id
 * @method Put
 * @access private(only user himself) 
*/

const updateUserCtrl = asynHandler(

    async (req, res) => {

        const userId = req.params.id;

        // Validate update data
        const { error } = validateUpdateUser(req.body);

        if (error) {

            return res.status(400).json({ message: error.details[0].message });

        }

        try {

            // 1. Find the user
            const user = await UserModel.findById(userId);

            if (!user) {

                return res.status(404).json({ message: "User not found" });

            }

            // 2. Update profile photo if new file uploaded
            if (req.file) {

                // Upload image to Cloudinary
                const uploadedImage = await cloudinaryUploadImage(req.file.path);

                // After uploading to Cloudinary, delete the file from the uploads folder
                fs.unlinkSync(path.join(__dirname, `../uploads/${req.file.filename}`));

                if (user.profilePhoto && user.profilePhoto.publicId) {

                    // If user has an existing profile photo, remove it from Cloudinary
                    await cloudinaryRemoveImage(user.profilePhoto.publicId);

                    console.log("Old profile photo removed from Cloudinary");

                }

                // Update user's profile photo
                user.profilePhoto = {
                    url: uploadedImage.secure_url,
                    publicId: uploadedImage.public_id
                };

            }

            // 3. Update user fields
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;

            // handle profession only if role is 'Other'
            if (req.body.role === "Other") {

                user.profession = req.body.profession || user.profession;

            } else {

                user.profession = undefined;

            }

            // 4. Handle password update if provided
            const { oldPassword, newPassword, confirmPassword } = req.body;

            if (oldPassword || newPassword || confirmPassword) {

                if (!oldPassword || !newPassword || !confirmPassword) {

                    return res.status(400).json({ message: "All password fields are required" });

                }

                const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

                if (!isPasswordMatch) {

                    return res.status(400).json({ message: "Old password is incorrect" });

                }

                if (newPassword !== confirmPassword) {

                    return res.status(400).json({ message: "New passwords do not match" });

                }

                const salt = await bcrypt.genSalt(10);

                const hashedPassword = await bcrypt.hash(newPassword, salt);

                // Save the new password that the user edited after hashing it
                user.password = hashedPassword;

            }

            // 5. Save updated user
            const updatedUser = await user.save();

            // Generate token  
            const token = user.generateToken();

            // Send response with updated user data (excluding password) and token
            res.status(200).json({
                updatedUser: {
                    _id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    profession: updatedUser.profession,
                    isAdmin: updatedUser.isAdmin,
                    profilePhoto: updatedUser.profilePhoto,
                    token: token, // Send the token in the response
                },
                message: "Profile updated successfully!",
                success: true
            });

        } catch (error) {

            console.error("Error updating user:", error);

            res.status(500).json({
                message: "Something went wrong while updating user.",
                error: error.message,
            });

        }

    }

);

/*===========================================*/

/**
 * @desc delete profile user
 * @route api/users/profile/:id
 * @method Delete
 * @access private(only user himself and admin) 
*/

const deleteUserCtrl = asynHandler(async (req, res) => {

    try {

        const userId = req.params.id;

        // 1. Find user
        const user = await UserModel.findById(userId);

        if (!user) {

            return res.status(404).json({ message: "User not found!" });

        }

        // 2. Get user's playlists
        const playlists = await PlaylistModel.find({ teacher: userId });

        // 3. Get all course IDs from those playlists
        const courseIds = playlists.map(pl => pl.courses).flat();

        // 4. Delete all courses in those playlists
        await CourseModel.deleteMany({ _id: { $in: courseIds } });

        // 5. Delete the playlists themselves
        await PlaylistModel.deleteMany({ teacher: userId });

        // 6. Remove saved playlists from users who saved them
        await UserModel.updateMany(
            { savedPlaylists: { $elemMatch: { $in: playlists.map(p => p._id) } } },
            { $set: { savedPlaylists: [] } }
        );

        // 7. Delete user's comments
        const deletedComments = await CommentModel.find({ user: userId });
        const deletedCommentIds = deletedComments.map(c => c._id);

        // Remove comment IDs from any courses
        await CourseModel.updateMany(
            { comment: { $in: deletedCommentIds } },
            { $pull: { comment: { $in: deletedCommentIds } } }
        );

        await CommentModel.deleteMany({ user: userId });

        // 8. Remove user ID from savedBy in playlists
        await PlaylistModel.updateMany(
            { savedBy: userId },
            { $pull: { savedBy: userId } }
        );

        // 9. Delete the user
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({ message: "User, their playlists, courses, and comments deleted!" });

    } catch (error) {

        console.error("Error in deleteUserCtrl:", error.message);

        res.status(500).json({ message: "Something went wrong.", error: error.message });

    }

}

);

/*===========================================*/

/**
 * @desc save a playlist by user
 * @route api/users/savePlaylist/:playlistId
 * @method Post
 * @access private(only user himself)
 */

const savedPlaylistsCtrl = asynHandler(

    async (req, res) => {

        try {

            const { playlistId } = req.params;

            const userId = req.userDecoded.id;

            // Validate IDs
            if (!playlistId || !userId) {

                return res.status(400).json({ message: "Both IDs are required" });

            }

            // Check playlist exists
            const playlist = await PlaylistModel.findById(playlistId);

            if (!playlist) {

                return res.status(404).json({ message: "Playlist not found" });

            }

            // Update user
            const user = await UserModel.findById(userId);

            if (!user) {

                return res.status(404).json({ message: "User not found" });

            }

            // Manual duplicate check
            if (!user.savedPlaylists.includes(playlistId)) {

                user.savedPlaylists.push(playlistId);

                await user.save();

            }

            playlist.savedBy.push(userId);    // who saved
            await playlist.save();            // Save the playlist 

            // Return populated data
            const updatedUser = await UserModel.findById(userId).populate('savedPlaylists');

            res.status(200).json({
                success: true,
                data: updatedUser.savedPlaylists,
                isSaved: true,
                message: "Playlist saved successfully"
            });

        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }

    }

);

/*===========================================*/

/**
 * @desc fetch saved user playlist
 * @route api/users/savedPlaylists
 * @method Get
 * @access public
 */

const fetchSavedPlaylistsCtrl = asynHandler(

    async (req, res) => {

        try {

            // accepts userId as query parameter instead of from token
            const userId = req.query.userId;

            if (!userId) {

                return res.status(400).json({ message: "User ID is required" });

            }

            const user = await UserModel.findById(userId).populate({
                path: 'savedPlaylists',
                populate: [
                    {
                        path: 'teacher',
                        select: 'username profilePhoto createdAt id'
                    },
                    {
                        path: 'courses',
                        select: '_id isCourseApproved'
                    }
                ]

            });

            if (!user) {

                return res.status(404).json({ message: "User not found" });

            }

            res.status(200).json({
                success: true,
                data: user.savedPlaylists,
                playListCount: user.savedPlaylists.length
            });

        } catch (error) {
            res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }

    }

);

/*===========================================*/

/**
 * @desc delete single saved playlist by user
 * @route api/users/savePlaylist/:playlistId
 * @method Delete
 * @access private(only user himself) 
 */

const deleteSingleSavedPlaylistCtrl = asynHandler(

    async (req, res) => {

        const { playlistId } = req.params;

        const userId = req.userDecoded.id;

        try {

            // 1. Check if user exists 
            const user = await UserModel.findById(userId);

            if (!user) {

                return res.status(404).json({ message: "User not found!" });

            }

            // 2. Check if playlist exists in user's savedPlaylists 
            const isPlaylistSaved = user.savedPlaylists.includes(playlistId);

            if (!isPlaylistSaved) {

                return res.status(404).json({ message: "Playlist not found in your saved items!" });

            }

            // 3. Remove playlist ID
            await UserModel.findByIdAndUpdate(

                userId,

                { $pull: { savedPlaylists: playlistId } }

            );

            res.status(200).json({
                success: true,
                message: "Playlist removed successfully!"
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });

        }

    }

);

/*===========================================*/

/**
 * @desc search for a teacher
 * @route api/users/teacherSearch
 * @method Get
 * @access public
 */

const teacherSearchCtrl = asynHandler(async (req, res) => {

    const query = req.query.q || "";

    try {

        // Find teachers matching query (or all if query is empty)
        const teachers = await UserModel.find({
            role: "Teacher",
            username: { $regex: query, $options: "i" },
        }).select("username role profilePhoto");

        // For each teacher, find playlists with courses populated
        const results = await Promise.all(

            teachers.map(async (teacher) => {

                const playlists = await PlaylistModel.find({ teacher: teacher._id }).populate("courses");

                return { teacher, playlists };

            })

        );

        res.status(200).json({ data: results });

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: "Server error while searching teachers" });

    }

}

);

/*===========================================*/

/**
 * @desc approved teacher by admin
 * @route api/users/approve-teacher/:id
 * @method Post
 * @access private(only admin) 
 */

const approveTeacherByAdminCtrl = asynHandler(

    async (req, res) => {

    }

);
/*===========================================*/

module.exports = {
    getAllUsersCtrl,
    getUserCtrl,
    updateUserCtrl,
    deleteUserCtrl,
    savedPlaylistsCtrl,
    fetchSavedPlaylistsCtrl,
    deleteSingleSavedPlaylistCtrl,
    teacherSearchCtrl,
    approveTeacherByAdminCtrl
}