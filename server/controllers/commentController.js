const asyncHandler = require("express-async-handler");
const {
    validateNewComment,
    CommentModel,
    validateUpdateComment } = require("../models/CommentModel");
const { CourseModel } = require("../models/CourseModel");

/*===========================================*/
/*===========================================*/
/*===========================================*/

/**
 *@desc add new comment
 *@route /api/comments
 *@method Post
 *@access private(only user himself)
*/

const newCommentCtrl = asyncHandler(

    async (req, res) => {

        const { error } = validateNewComment(req.body);

        if (error) {

            return res.status(400).json({ message: error.details[0].message });

        }

        const { text, courseId } = req.body;

        const comment = await CommentModel.create({
            courseId,
            text,
            user: req.userDecoded.id
        });

        // Push the comment into the course's comment array
        await CourseModel.findByIdAndUpdate(courseId, {
            $push: { comment: comment._id }
        });

        res.status(200).json({
            comment,
            success: true,
            message: "Comment added successfully!"
        });

    }

);

/*===========================================*/

/**
 *@desc get all comments
 *@route /api/comments
 *@method Get
 *@access private(only login users)
*/

const getAllCommentCtrl = asyncHandler(

    async (req, res) => {

        const comments = await CommentModel.find()
            .sort({ _id: -1 })
            .populate('user', 'username profilePhoto role');

        res.status(200).json({ commentsCount: comments.length, comments });

    }

);

/*===========================================*/

/**
 *@desc get single comment
 *@route /api/comments/:commentId
 *@method Get
 *@access private(only login users)
*/

const getSingleCommentCtrl = asyncHandler(

    async (req, res) => {

        const comment = await CommentModel.findById(req.params.commentId)
            .populate('user', 'username profilePhoto role');

        if (!comment) {

            return res.status(404).json({ message: "this comment dosent exist !" });

        } else {

            res.status(200).json(comment);

        }

    }

);

/*===========================================*/

/**
 *@desc remove single comment
 *@route /api/comments/:commentId
 *@method Delete
 *@access private(only the owner of the comment)
*/

const removeSingleCommentCtrl = asyncHandler(async (req, res) => {

    const comment = await CommentModel.findById(req.params.commentId);

    if (!comment) {

        return res.status(404).json({ message: "The comment does not exist!" });

    }

    if (comment.user.toString() !== req.userDecoded.id.toString()) {

        return res.status(403).json({ message: "You are not authorized to delete this comment!" });

    }

    // Remove comment ID from course
    await CourseModel.updateOne(
        { _id: comment.courseId },
        { $pull: { comment: comment._id } }
    );

    // Delete the comment
    await CommentModel.findByIdAndDelete(req.params.commentId);

    res.status(200).json({ success: true, message: "Comment removed successfully!" });

});

/*===========================================*/

/**
 *@desc edit single comment
 *@route /api/comments/:commentId
 *@method Put
 *@access private(only the owner of the comment)
*/

const editSingleCommentCtrl = asyncHandler(

    async (req, res) => {

        const user = req.userDecoded.id;

        // const { courseId, text } = req.body;
        const { text } = req.body;

        // Validate input
        const { error } = validateUpdateComment(req.body);

        if (error) {

            return res.status(400).json({ message: error.details[0].message });

        }

        // Find the comment by ID
        const comment = await CommentModel.findById(req.params.commentId);

        if (!comment) {

            return res.status(404).json({ message: "The comment does not exist!" });

        }

        // Check if the user is the owner of the comment
        if (comment.user._id.toString() !== user) {

            return res.status(403).json({ message: "You are not authorized to edit this comment!" });

        }

        // Update the comment
        await CommentModel.findByIdAndUpdate(req.params.commentId, {
            //  courseId,
            text,
        }, { new: true });

        const updatedComment = await CommentModel.findById(req.params.commentId)
            .populate('user', 'username profilePhoto role');

        res.status(200).json({
            success: true,
            message: "Comment updated successfully!",
            updatedComment
        });

    }

);

/*===========================================*/

module.exports = {
    newCommentCtrl,
    getAllCommentCtrl,
    getSingleCommentCtrl,
    removeSingleCommentCtrl,
    editSingleCommentCtrl
}