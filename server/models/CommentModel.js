const { Schema, model } = require("mongoose");
const Joi = require("joi");

/*=========================================*/
/*=========================================*/
/*=========================================*/

const commentSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        trim: true,
        minLength: 5,
        maxLength: 500,
        required: true
    }
},
    { timestamps: true }
);

/*=========================================*/

function validateNewComment(obj) {

    const schema = Joi.object({

        courseId: Joi.string().required().label("Course ID"),

        text: Joi.string().trim().min(5).max(500).required().label("Comment")

    });

    return schema.validate(obj);

}

/*=========================================*/

function validateUpdateComment(obj) {

    const schema = Joi.object({

        courseId: Joi.string().required().label("Course ID"),

        text: Joi.string().trim().min(5).max(500).label("Comment")

    });

    return schema.validate(obj);

}

/*=========================================*/

const CommentModel = new model("Comment", commentSchema);

/*=========================================*/

module.exports = {
    CommentModel,
    validateNewComment,
    validateUpdateComment
}