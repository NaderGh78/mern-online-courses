const router = require("express").Router();
const { registerCtrl, loginCtrl } = require("../controllers/authController");
const photoUpload = require("../middlewares/photoUpload");

/*===========================================*/
/*===========================================*/
/*===========================================*/

// /api/auth/register
router.post("/register", photoUpload.single("profilePhoto"), registerCtrl);

// /api/auth/login
router.post("/login", loginCtrl);

/*===========================================*/

module.exports = router; 