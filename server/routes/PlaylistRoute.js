const router = require("express").Router();
const {
  createPlaylistCtrl,
  getAllPlaylistsCtrl,
  getSinglePlaylistCtrl,
  deletePlaylistCtrl,
  updatePlaylistCtrl,
  getAllPlaylistsForTeacherCtrl,
  getAllCoursesFromPlaylistCtrl,
  searchPlaylistCtrl,
  approvePlaylistByAdminCtrl } = require("../controllers/playListController");
const photoUpload = require("../middlewares/photoUpload");
const { validateObjectId } = require("../middlewares/validateObjectId");
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

/*=========================================*/
/*=========================================*/
/*=========================================*/

router.get("/:playlistId/courses", getAllCoursesFromPlaylistCtrl);

/*=========================================*/

// /api/playlists
router.route("/")
  .post(
    verifyToken,
    photoUpload.single("mainPlaylistImage"),
    createPlaylistCtrl)
  .get(getAllPlaylistsCtrl);

/*=========================================*/

// /api/playlists/searchPlaylist
router.route("/search-playlist").get(searchPlaylistCtrl);

/*=========================================*/

// /api/playlists/id
router.route("/:id")
  .get(validateObjectId, getSinglePlaylistCtrl)
  .put(
    verifyToken,
    validateObjectId,
    photoUpload.single("mainPlaylistImage"),
    updatePlaylistCtrl);

/*=========================================*/

//get all belong teacher playlists  
router.get('/teacher/:teacherId', getAllPlaylistsForTeacherCtrl);

/*=========================================*/

// /api/playlists/:playlistId/:teacherId  
router.delete('/:playlistId/:teacherId', verifyToken, validateObjectId, deletePlaylistCtrl);

/*=========================================*/

// /api/playlists/approve-playlist/:playlistId => only admin will approve to any playlist by teacher
router.post("/approve-playlist/:playlistId",
  validateObjectId,
  verifyTokenAndAdmin,
  approvePlaylistByAdminCtrl);

/*=========================================*/

module.exports = router;