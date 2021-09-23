const express = require("express");
const router = express.Router();

//validator import;
const { addIdeaValidate } = require("../validators/addIdeaValidators");
const { updateIdeaValidators } = require("../validators/updateIdeaValidators");
const { ideaValidators } = require("../validators/ideaValidators");

//controllers import;
const {
  getIdeaController,
  addIdeaController,
  postIdeaController,
  editIdeaController,
  updateIdeaController,
  deleteIdeaController,
  getSingleIdeaController,
} = require("../controllers/ideaControllers");

//login in middleware check;
const { isAuth, checkIdeaOwnership } = require("../middleware/authMiddleware");

//get all ideas
router.get("/", getIdeaController);

//show form to add idea;
router.get("/new", isAuth, addIdeaController);

//add idea;
router.post("/", isAuth, ideaValidators(), addIdeaValidate, postIdeaController);

//show edit idea from;
router.get("/:id/edit", isAuth, checkIdeaOwnership, editIdeaController);

//update ideas
router.put(
  "/:id",
  isAuth,
  checkIdeaOwnership,
  ideaValidators(),
  updateIdeaValidators,
  updateIdeaController
);

//delete route;
router.delete("/:id", checkIdeaOwnership, isAuth, deleteIdeaController);

//get single idea
router.get("/:id", getSingleIdeaController);

module.exports = router;
