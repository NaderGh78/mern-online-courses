const router = require("express").Router();
const {
    addCatCtrl,
    allCatCtrl,
    editSinglCatCtrl,
    deleteSinglCatCtrl } = require("../controllers/categoriesController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { validateObjectId } = require("../middlewares/validateObjectId");

/*=========================================*/
/*=========================================*/
/*=========================================*/

// /api/categories
router.route("/")
    .post(verifyTokenAndAdmin, addCatCtrl)
    .get(allCatCtrl);

/*=========================================*/

// router.route("/").get(allCatCtrl);  
router.route("/:id")
    .put(validateObjectId, verifyTokenAndAdmin, editSinglCatCtrl)
    .delete(validateObjectId, verifyTokenAndAdmin, deleteSinglCatCtrl);

/*=========================================*/

module.exports = router;