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

//after login you cannot see login and register page;
const { ensureGuest } = require("../middleware/authMiddleware");

router.get("/register", ensureGuest, getRegisterController);

router.get("/login", ensureGuest, getLoginController);

router.get("/logout", getLogoutController);

router.post(
  "/register",
  ensureGuest,
  reginterValidators(),
  registerValidate,
  postRegisterController
  // (req, res) => {
  //   console.log(req.body, "user body");
  // }
);

//post login controller
// router.post("/login", loginValidators(), loginValidate, postLoginController);

//using passport for login controller
router.post(
  "/login",
  ensureGuest,
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
  ensureGuest,
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
