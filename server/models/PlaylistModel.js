const { Schema, model } = require("mongoose");
const Joi = require("joi");

/*=========================================*/
/*=========================================*/
/*=========================================*/

const playlistSchema = new Schema({
    teacher: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courses: [
        { type: Schema.Types.ObjectId, ref: "Course" }
    ],
    savedBy: [
        { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    title: {
        type: String,
        minLength: 5,
        maxLength: 50,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        minLength: 5,
        maxLength: 250,
        required: true,
        trim: true
    },
    category: {
        type: String,
        minLength: 2,
        maxLength: 150,
        required: true,
        trim: true
    },
    mainPlaylistImage: {
        type: Object,
        default: {
            url: `${process.env.BACKEND_URL}/uploads/no-picture.jpg`,
            publicId: null
        }
    },
    isPlaylistApproved: {
        type: String,
        enum: ["pending", "processing", "approved", "cancel"],
        default: "pending"
    }
}, { timestamps: true });

/*=========================================*/


function validateNewPlayList(obj) {

    const schema = Joi.object({

        title: Joi.string().min(5).max(50).required(),

        description: Joi.string().min(5).max(250).required(),

        category: Joi.string().min(2).max(150).required()

    })

    return schema.validate(obj)

}

/*=========================================*/

function validateUpdatePlayList(obj) {

    const schema = Joi.object({

        title: Joi.string().min(5).max(50),

        description: Joi.string().min(5).max(250),

        category: Joi.string().min(2).max(150),

        isPlaylistApproved: Joi.string().valid("pending", "processing", "approved", "cancel")
        // mainPlaylistImage is handled in multer & cloudinary

    })

    return schema.validate(obj)

}

/*=========================================*/

const PlaylistModel = model("Playlist", playlistSchema);

/*=========================================*/

module.exports = {
    PlaylistModel,
    validateNewPlayList,
    validateUpdatePlayList
}; 