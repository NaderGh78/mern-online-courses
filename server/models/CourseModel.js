const { Schema, model } = require("mongoose");
const Joi = require("joi");

/*=========================================*/
/*=========================================*/
/*=========================================*/

const courseSchema = new Schema({
    playlist: {
        type: Schema.Types.ObjectId,
        ref: "Playlist"
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comment: [
        { type: Schema.Types.ObjectId, ref: "Comment" }
    ],
    likes: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    videoTitle: {
        type: String,
        minLength: 5,
        maxLength: 150,
        required: true,
        trim: true
    },
    description: {
        type: String,
        minLength: 5,
        maxLength: 150,
        required: true,
        trim: true
    },
    tutorialImage: {
        type: Object,
        default: {
            url: `${process.env.BACKEND_URL}/uploads/no-picture.jpg`,
            publicId: null
        }
    },
    videoLink: {
        type: String,
        minLength: 5,
        maxLength: 500,
        required: true,
        trim: true
    },
    isCourseApproved: {
        type: String,
        enum: ["pending", "processing", "approved", "cancel"],
        default: "pending"
    }

}, { timestamps: true });

/*=========================================*/

function validateCourse(obj) {

    const schema = Joi.object({

        videoTitle: Joi.string().min(5).max(150).required(),

        description: Joi.string().min(5).max(150).required(),

        videoLink: Joi.string().min(5).max(500).required()

    })

    return schema.validate(obj)

}

/*=========================================*/

// validate update status course 
function validateUpdateStatus(obj) {

    const schema = Joi.object({

        isCourseApproved: Joi.string().valid("pending", "processing", "approved", "cancel")

    })

    return schema.validate(obj)

}
/*=========================================*/

const CourseModel = model("Course", courseSchema);

/*=========================================*/

module.exports = {
    CourseModel,
    validateCourse,
    validateUpdateStatus
}; 