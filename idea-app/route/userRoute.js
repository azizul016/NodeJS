const express = require("express");
const router = express.Router();

//login in middleware check;
const { isAuth } = require("../middleware/authMiddleware");

//updated user validator;
const { updateUserValidators } = require("../validators/userValidators");
//update user validate;
const { updateValidate } = require("../validators/userValidate");

//controller middleware
const {
  getUserController,
  editUserController,
  updateUserController,
  getUserIdeasController,
  deleteUserController,
  deshboardController,
} = require("../controllers/userControllers");

//home page route
router.get("/me", isAuth, getUserController);

//get route for edit profile
router.get("/me/edit", isAuth, editUserController);

//update user profile;
router.put(
  "/me",
  isAuth,
  updateUserValidators(),
  updateValidate,
  updateUserController
);

//deshboard controller;
router.get("/me/ideas", deshboardController);

//get all ideas by perticular user;
//:id/ideas
router.get("/:id/ideas", getUserIdeasController);

//delete user account;
//me;
router.delete("/me", isAuth, deleteUserController);

module.exports = router;
