const asynHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const {
  UserModel,
  validateRegisterUser,
  validateLoginUser } = require("../models/UserModel");
const path = require("path");
const fs = require("fs");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

/*===========================================*/
/*===========================================*/
/*===========================================*/

/**
 *@desc register new user 
 *@route /api/auth 
 *@method Post
 *@access public
*/

const registerCtrl = asynHandler(

  async (req, res) => {

    // Validate user input first
    const { error } = validateRegisterUser(req.body);

    if (error) {

      // If validation fails, delete the uploaded file (if any)
      if (req.file) {

        fs.unlinkSync(path.join(__dirname, `../uploads/${req.file.filename}`));

      }

      return res.status(400).json({ message: error.details[0].message });

    }

    // Check if user already exists
    let user = await UserModel.findOne({ email: req.body.email });

    if (user) {

      return res.status(400).json({ message: "User already exists" });

    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Default profile photo if no photo is uploaded
    let profilePhoto = {

      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",

      publicId: null

    };

    // If file exists, upload it to Cloudinary
    if (req.file) {

      const imagePath = path.join(__dirname, `../uploads/${req.file.filename}`);

      try {

        const cloudinaryResponse = await cloudinaryUploadImage(imagePath);

        profilePhoto = {

          url: cloudinaryResponse.secure_url,

          publicId: cloudinaryResponse.public_id

        };

        // Delete the file after uploading it to Cloudinary
        fs.unlinkSync(imagePath);

      } catch (error) {

        return res.status(500).json({ message: "Failed to upload profile photo." });

      }

    }

    // Create the new user
    user = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
      profession: req.body.role === 'Other' ? req.body.profession : undefined,
      profilePhoto: profilePhoto,
    });

    // Save user to the database
    await user.save();

    // Send success response (excluding password from the response)
    const { password, ...userWithoutPassword } = user._doc;
    res.status(201).json({
      message: "Registration successful, please log in.",
      user: userWithoutPassword,
    });

  }

);

/*===========================================*/

/**
 *@desc login user 
 *@route /api/auth 
 *@method Post
 *@access public
*/
const loginCtrl = asynHandler(

  async (req, res) => {

    // 1. validation
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // 2. is user exist
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    // 3. check the password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    // 4. generate the token (jwt)
    const token = user.generateToken();

    // 5. send response to client
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profession: user.profession,
      isAdmin: user.isAdmin,
      profilePhoto: user.profilePhoto,
      token,
      message: "Login successful, please go main page."
    })

  }

);

/*===========================================*/

module.exports = {
  registerCtrl,
  loginCtrl
}