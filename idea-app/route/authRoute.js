const express = require("express");
const router = express.Router();
const passport = require("passport");

const rateLimit = require("express-rate-limit");

const {
  getRegisterController,
  postRegisterController,
  getLoginController,
  postLoginController,
  getLogoutController,
  getGoogleController,
  accountActivationController,
  getForgetPasswordController,
  postForgotPasswordController,
  getResetPasswordController,
  postResetPasswordController,
} = require("../controllers/authControllers");

const {
  reginterValidators,
  loginValidators,
  forgetPasswordValidators,
  resetPasswordValidators,
} = require("../validators/userValidators");
const {
  registerValidate,
  loginValidate,
  forgetPasswordValidate,
  resetPasswordValidate,
} = require("../validators/userValidate");

//after login you cannot see login and register page;
const { ensureGuest } = require("../middleware/authMiddleware");

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

router.get("/register", ensureGuest, getRegisterController);

router.get("/login", ensureGuest, getLoginController);

router.get("/logout", getLogoutController);

router.post(
  "/register",
  ensureGuest,
  reginterValidators(),
  registerValidate,
  registerLimiter,
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

//account active by email get route;
///auth/active/:token;
router.get("/active/:token", accountActivationController);

//get forget password route;
router.get("/forget-password", getForgetPasswordController);

//password forget post route;
router.post(
  "/forget-password",
  forgetPasswordValidators(),
  forgetPasswordValidate,
  postForgotPasswordController
);

//reset password controller
///auth/:reset-passeword/:token
router.get("/reset-password/:token", getResetPasswordController);

//reset password controller
///auth/:reset-passeword/:token
router.post(
  "/reset-password",
  resetPasswordValidators(),
  resetPasswordValidate,
  postResetPasswordController
);

module.exports = router;
