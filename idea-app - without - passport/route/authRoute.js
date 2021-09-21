const express = require("express");
const router = express.Router();

const {
  getRegisterController,
  postRegisterController,
  getLoginController,
  postLoginController,
  getLogoutController,
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

router.post("/login", loginValidators(), loginValidate, postLoginController);

module.exports = router;
