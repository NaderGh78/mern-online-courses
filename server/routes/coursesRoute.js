const router = require("express").Router();
const {
   createCourseCtrl,
   getSingleCourseCtrl,
   deleteSingleCourseCtrl,
   getAllCoursesCtrl,
   editCourseCtrl,
   addLikeOnCourseCtrl,
   approveCourseByAdminCtrl } = require("../controllers/coursesController");
const {
   verifyTeacher,
   verifyToken,
   verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const photoUpload = require("../middlewares/photoUpload");
const { validateObjectId } = require("../middlewares/validateObjectId");

/*=========================================*/
/*=========================================*/
/*=========================================*/

// /api/courses/:playlistId
router.route("/:playlistId")
   .get(getAllCoursesCtrl)
   .post(
      validateObjectId,
      verifyTeacher,
      photoUpload.single("tutorialImage"),
      createCourseCtrl
   );

/*=========================================*/

// /api/courses/:playlistId/:courseId
router.route("/:playlistId/:courseId")
   .get(validateObjectId, getSingleCourseCtrl)
   .delete(validateObjectId, verifyTeacher, deleteSingleCourseCtrl)
   .put(
      validateObjectId,
      verifyTeacher,
      photoUpload.single("tutorialImage"),
      editCourseCtrl
   );

/*=========================================*/

// /api/courses/:courseId/like
router.route("/:courseId/like").post(validateObjectId, verifyToken, addLikeOnCourseCtrl);

/*=========================================*/

// /api/courses/approve-course/:courseId => only admin will approve to any course by teacher
router.post("/approve-course/:courseId",
   validateObjectId,
   verifyTokenAndAdmin,
   approveCourseByAdminCtrl);

/*=========================================*/

module.exports = router;