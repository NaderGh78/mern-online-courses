const { Schema, model } = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

/*=========================================*/
/*=========================================*/
/*=========================================*/

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: false,
        trim: true,
        minlength: 8
    },
    role: {
        type: String,
        required: true,
        enum: ["Teacher", "Student", "Other"]
    },
    profession: {
        type: String,
        required: function () {
            return this.role === 'Other'; // Profession is required only if role is 'Other'
        },
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    courses: [
        { type: Schema.Types.ObjectId, ref: "Course" }
    ],
    playlists: [
        { type: Schema.Types.ObjectId, ref: "Playlist" }
    ],
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
            publicId: null
        }
    },
    createdPlaylists: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Playlist'
        }
    ],
    savedPlaylists:
        [
            {
                type: Schema.Types.ObjectId, ref: 'Playlist'
            }

        ],
    isAdmin: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

/*=========================================*/

// generate token
userSchema.methods.generateToken = function () {

    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET_KEY);

}

/*=========================================*/

// validate register user func
function validateRegisterUser(obj) {

    const schema = Joi.object({

        username: Joi.string().trim().min(2).max(100).required(),

        email: Joi.string().trim().min(5).max(100).required().email(),

        password: Joi.string().trim().min(8).required(),

        confirmPassword: Joi.string().trim().min(8).valid(Joi.ref('password')).required().messages({
            'any.only': 'Confirm password must match password'
        }),

        role: Joi.string().valid("Teacher", "Student", "Other").required(),

        profession: Joi.when('role', {
            is: 'Other',
            then: Joi.string().trim().min(2).max(100).required(),
            otherwise: Joi.forbidden() // Profession is not required for Teacher/Student
        })

    });

    return schema.validate(obj);

}

/*=========================================*/

// validate login user func
function validateLoginUser(obj) {

    const schema = Joi.object({

        email: Joi.string().trim().min(5).max(100).required().email(),

        password: Joi.string().trim().min(8).required()

    })

    return schema.validate(obj)

}

/*=========================================*/

// validate update user func
function validateUpdateUser(obj) {

    const schema = Joi.object({

        username: Joi.string().trim().min(2).max(100),

        email: Joi.string().trim().min(5).max(100).email(),

        role: Joi.string().valid("Teacher", "Student", "Other"),

        profession: Joi.when('role', {
            is: 'Other',
            then: Joi.string().trim().min(2).max(100).required(),
            otherwise: Joi.forbidden()
        }),

        oldPassword: Joi.string().trim().min(8),

        newPassword: Joi.string().trim().min(8),

        confirmPassword: Joi.any().valid(Joi.ref('newPassword')).messages({
            'any.only': 'Confirm password must match new password'
        })

    });

    return schema.validate(obj);

}

/*=========================================*/

// create user model
const UserModel = new model("User", userSchema);

/*=========================================*/

module.exports = {
    UserModel,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
}