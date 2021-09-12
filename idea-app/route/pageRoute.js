const express = require("express");
const router = express.Router();

//controller import;
const {
  homeController,
  aboutController,
  notFoundController,
} = require("../controllers/pageController");

//home page route
router.get("/", homeController);

//about us route;
router.get("/about", aboutController);

router.get("*", notFoundController);

module.exports = router;
