const express = require("express");
const router = express.Router();

const {
  addCategoryController,
  postCategoryController,
  getCategoryController,
  deleteCategoryController,
  getCategoryNameByIdeaController,
} = require("../controllers/categoryControllers");

//category validators;
const {
  categoryValidators,
} = require("../validators/category-validation/categoryValidators");

//category validate;
const {
  categoryValidate,
} = require("../validators/category-validation/categoryValidate");

//is auth and admin middleware;
const { isAuth, ensureAdmin } = require("../middleware/authMiddleware");

///category/new for get category form;
router.get("/new", isAuth, ensureAdmin, addCategoryController);

// adding category in database;
//category ;
router.post(
  "/",
  categoryValidators(),
  categoryValidate,
  isAuth,
  ensureAdmin,
  postCategoryController
);

//get all category;
router.get("/", getCategoryController);

//delete category;
router.delete("/:categoryName", deleteCategoryController);

//getting all ideas that creat a category;
router.get("/:categoryName/ideas", getCategoryNameByIdeaController);

module.exports = router;
