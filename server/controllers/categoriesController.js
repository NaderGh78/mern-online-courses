const asyncHandler = require("express-async-handler");
const {
    CategoryModel,
    addNewCatValidation,
    editSingleCatValidation } = require("../models/CategoryModel");

/*===========================================*/
/*===========================================*/
/*===========================================*/

/**
 *@desc add new category
 *@route /api/categories
 *@method Post
 *@access private (admin only) 
*/

const addCatCtrl = asyncHandler(

    async (req, res) => {

        // get the title from body
        const { title } = req.body;

        // validation
        const { error } = addNewCatValidation(req.body);

        // show error validation
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // check if the category already exist
        let category = await CategoryModel.findOne({ title });

        // if the category exist return error msg
        if (category) {
            return res.status(400).json({ message: "The category already exist!" });
        }

        // otherwise create a new category with provided title
        category = await CategoryModel.create({ title });

        res.status(201).json(
            {
                category,
                success: true,
                message: "New category added successfully!"
            }
        );

    }

);

/*===========================================*/

/**
 *@desc get all categories
 *@route /api/categories
 *@method Get
 *@access public  
*/

const allCatCtrl = asyncHandler(

    async (req, res) => {

        const categories = await CategoryModel.find();

        // get all categories with its length
        res.status(200).json({ catLeng: categories.length, categories });

    }

);

/*===========================================*/

/**
 *@desc edit single category
 *@route /api/categories/:id
 *@method Put
 *@access private (admin only)  
*/

const editSinglCatCtrl = asyncHandler(

    async (req, res) => {

        // get the id from params
        const { id } = req.params;

        // get the title from body
        const { title } = req.body;

        // validation 
        const { error } = editSingleCatValidation(req.body);

        // show error validation
        if (error) {

            return res.status(400).json({ message: error.details[0].message });

        }

        // first get the category with provided id
        let category = await CategoryModel.findById(id);

        // if the category dosent exist, return error msg
        if (!category) {

            return res.status(404).json({ message: "The category dosent exist!" });

        }

        // otherwise update the category with succes msg
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, { $set: { title } }, { new: true });

        res.status(200).json({ message: "The category updated successfully!", category: updatedCategory });

    }

);

/*===========================================*/
/**
 *@desc delete single category
 *@route /api/categories/:id
 *@method Delete
 *@access private (admin only)  
*/

const deleteSinglCatCtrl = asyncHandler(

    async (req, res) => {

        // get the id from params
        const { id } = req.params;

        // first get the category with provided id
        const category = await CategoryModel.findById(id);

        // if the category dosent exist, return error msg
        if (!category) {

            return res.status(404).json({ message: "The category dosent exist!" });

        }

        // otherwise delete the category with succes msg
        await CategoryModel.findByIdAndDelete(id);

        res.status(200).json({ message: "The category deleted successfully!" });

    }

);

/*===========================================*/

module.exports = {
    addCatCtrl,
    allCatCtrl,
    editSinglCatCtrl,
    deleteSinglCatCtrl
}