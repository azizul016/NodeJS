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
const { isAuth } = require("../middleware/authMiddleware");

//get all ideas
router.get("/", getIdeaController);

//show form to add idea;
router.get("/new", isAuth, addIdeaController);

//add idea;
router.post("/", isAuth, ideaValidators(), addIdeaValidate, postIdeaController);

//show edit idea from;
router.get("/:id/edit", isAuth, editIdeaController);

//update ideas
router.put(
  "/:id",
  isAuth,
  ideaValidators(),
  updateIdeaValidators,
  updateIdeaController
);

//delete route;
router.delete("/:id", isAuth, deleteIdeaController);

//get single idea
router.get("/:id", getSingleIdeaController);

module.exports = router;
