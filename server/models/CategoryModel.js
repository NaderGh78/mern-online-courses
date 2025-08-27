const { Schema, model } = require("mongoose");
const Joi = require("joi");

/*===========================================*/
/*===========================================*/
/*===========================================*/

const categorySchema = new Schema({
    title: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 200,
        required: true,
        unique: true
    }
},
    { timestamps: true }
);
/*===========================================*/

function addNewCatValidation(obj) {

    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(200).required(),
    })

    return schema.validate(obj);

}

/*===========================================*/

function editSingleCatValidation(obj) {

    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(200),
    })

    return schema.validate(obj);

}

/*===========================================*/

const CategoryModel = new model("Categories", categorySchema);

/*===========================================*/

module.exports = {
    CategoryModel,
    addNewCatValidation,
    editSingleCatValidation
}