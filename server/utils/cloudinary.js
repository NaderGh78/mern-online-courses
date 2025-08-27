const cloudinary = require("cloudinary");

/*===========================================*/
/*===========================================*/
/*===========================================*/

cloudinary.config({

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    api_key: process.env.CLOUDINARY_API_KEY,

    api_secret: process.env.CLOUDINARY_API_SECRET,

});

// Cloudinary Upload Image
const cloudinaryUploadImage = async (fileToUpload) => {

    try {

        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: "auto",
            folder: "online-courses/users",
        });

        console.log("Image uploaded to:", data.secure_url);

        return data;

    } catch (error) {

        console.log(error);

        throw new Error("Internal Server Error (cloudinary)");

    }

};

/*===========================================*/

// Cloudinary Remove Image
const cloudinaryRemoveImage = async (imagePublicId) => {

    try {

        const result = await cloudinary.uploader.destroy(imagePublicId);

        return result;

    } catch (error) {

        console.log(error);

        throw new Error("Internal Server Error (cloudinary)");

    }
};

/*===========================================*/

module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage
};