const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  getRegisterController,
  postRegisterController,
  getLoginController,
  postLoginController,
  getLogoutController,
  getGoogleController,
} = require("../controllers/authControllers");

const {
  reginterValidators,
  loginValidators,
} = require("../validators/userValidators");
const {
  registerValidate,
  loginValidate,
} = require("../validators/userValidate");

router.get("/register", getRegisterController);

router.get("/login", getLoginController);

router.get("/logout", getLogoutController);

router.post(
  "/register",
  reginterValidators(),
  registerValidate,
  postRegisterController
);

//post login controller
// router.post("/login", loginValidators(), loginValidate, postLoginController);

//using passport for login controller
router.post(
  "/login",
  loginValidators(),
  loginValidate,
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  postLoginController
);

//for google route;
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  getGoogleController
);

module.exports = router;
