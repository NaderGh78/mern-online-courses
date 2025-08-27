const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const { validateObjectId } = require("../middlewares/validateObjectId");
const {
    newCommentCtrl,
    getSingleCommentCtrl,
    getAllCommentCtrl,
    removeSingleCommentCtrl,
    editSingleCommentCtrl } = require("../controllers/commentController");

/*=========================================*/
/*=========================================*/
/*=========================================*/

// /api/comments
router.route("/")
    .post(verifyToken, newCommentCtrl)
    .get(verifyToken, getAllCommentCtrl)

/*=========================================*/

// /api/comments/:commentId
router.route("/:commentId")
    .get(validateObjectId, getSingleCommentCtrl)
    .delete(validateObjectId, verifyToken, removeSingleCommentCtrl)
    .put(validateObjectId, verifyToken, editSingleCommentCtrl);

/*=========================================*/

module.exports = router;