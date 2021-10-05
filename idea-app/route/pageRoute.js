const express = require("express");
const router = express.Router();

// after login you can see first deshboard

const { ensureGuest } = require("../middleware/authMiddleware");

//controller import;
const {
  homeController,
  aboutController,
  notFoundController,
} = require("../controllers/pageController");

//home page route
router.get("/", ensureGuest, homeController);

//about us route;
router.get("/about", aboutController);

router.get("*", notFoundController);

module.exports = router;
