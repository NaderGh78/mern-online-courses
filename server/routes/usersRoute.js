const router = require("express").Router();
const {
    getAllUsersCtrl,
    getUserCtrl,
    deleteUserCtrl,
    updateUserCtrl,
    fetchSavedPlaylistsCtrl,
    savedPlaylistsCtrl,
    deleteSingleSavedPlaylistCtrl,
    teacherSearchCtrl
} = require("../controllers/usersController");
const photoUpload = require("../middlewares/photoUpload");
const { validateObjectId } = require("../middlewares/validateObjectId");
const { verifyTokenAndOnlyUser, verifyToken } = require("../middlewares/verifyToken");

/*=========================================*/
/*=========================================*/
/*=========================================*/

// /api/users/profile
router.route("/profile").get(getAllUsersCtrl);

/*=========================================*/

// /api/users/teacherSearch
router.route("/teacherSearch").get(teacherSearchCtrl);

/*=========================================*/

// /api/users/profile/:id
router.route("/profile/:id")
    .get(validateObjectId, getUserCtrl)
    .put(validateObjectId,
        verifyTokenAndOnlyUser,
        photoUpload.single("profilePhoto"),
        updateUserCtrl)
    .delete(validateObjectId, deleteUserCtrl);

/*=========================================*/

// save playlist by user
// /api/users/savePlaylist/:playlistId
router.post("/savePlaylist/:playlistId", verifyToken, savedPlaylistsCtrl);

/*=========================================*/

// /api/users/savedPlaylists
router.get("/savedPlaylists", fetchSavedPlaylistsCtrl);

// /api/users/savePlaylist/:playlistId
router.delete("/savedPlaylists/:playlistId", validateObjectId, verifyToken, deleteSingleSavedPlaylistCtrl);

/*=========================================*/

// // /api//users/approve-teacher/:id 
// router.post("/approve-teacher/:id", validateObjectId, verifyTokenAndAdmin, approveTeacherByAdminCtrl);

/*=========================================*/

module.exports = router;