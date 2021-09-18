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

//get all ideas
router.get("/", getIdeaController);

//show form to add idea;
router.get("/new", addIdeaController);

//add idea;
router.post("/", ideaValidators(), addIdeaValidate, postIdeaController);

//show edit idea from;
router.get("/:id/edit", editIdeaController);

//update ideas
router.put(
  "/:id",
  ideaValidators(),
  updateIdeaValidators,
  updateIdeaController
);

//delete route;
router.delete("/:id", deleteIdeaController);

//get single idea
router.get("/:id", getSingleIdeaController);

module.exports = router;
