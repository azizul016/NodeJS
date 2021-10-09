const express = require("express");
const router = express.Router();

//validator import;
const { addIdeaValidate } = require("../validators/addIdeaValidators");
const { updateIdeaValidators } = require("../validators/updateIdeaValidators");
const { ideaValidators } = require("../validators/ideaValidators");

//multer require;
const { ideaImageUpload } = require("../middleware/multer/multerConfig");

//controllers import;
const {
  getIdeaController,
  addIdeaController,
  postIdeaController,
  editIdeaController,
  updateIdeaController,
  deleteIdeaController,
  getSingleIdeaController,
  postLikeController,
  getLikeCountController,
  getCommentCountController,
} = require("../controllers/ideaControllers");

//login in middleware check;
const { isAuth, checkIdeaOwnership } = require("../middleware/authMiddleware");

//get all ideas
router.get("/", getIdeaController);

//show form to add idea;
router.get("/new", isAuth, addIdeaController);

//add idea;
router.post(
  "/",
  isAuth,
  ideaImageUpload,
  ideaValidators(),
  addIdeaValidate,
  postIdeaController
);

//show edit idea from;
router.get("/:id/edit", isAuth, checkIdeaOwnership, editIdeaController);

//update ideas
router.put(
  "/:id",
  isAuth,
  ideaImageUpload,
  checkIdeaOwnership,
  ideaValidators(),
  updateIdeaValidators,
  updateIdeaController
);

//delete route;
router.delete("/:id", checkIdeaOwnership, isAuth, deleteIdeaController);

//get single idea
router.get("/:id", getSingleIdeaController);

//add like and remove like
//ideas/:id/likes
router.post("/:id/likes", isAuth, postLikeController);
router.get("/:id/likes", getLikeCountController);
router.get("/:id/comments", getCommentCountController);

module.exports = router;
