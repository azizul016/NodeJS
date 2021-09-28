const express = require("express");
const router = express.Router();

//login in middleware check;
const { isAuth } = require("../middleware/authMiddleware");

//controller middleware
const { getUserController } = require("../controllers/userControllers");

//home page route
router.get("/me", isAuth, getUserController);

module.exports = router;
