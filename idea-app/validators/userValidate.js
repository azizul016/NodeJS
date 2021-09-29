const { validationResult } = require("express-validator");
const User = require("../models/user");

const registerValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("auth/register", {
      title: "Register For Shairing Password",
      errMsg: errors.array()[0].msg,
      userInput: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  } else {
    return next();
  }
};

//login validate
const loginValidate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("auth/login", {
      title: "Login For Shairing Password",
      errMsg: errors.array()[0].msg,
      userInput: {
        email: req.body.email,
      },
    });
  } else {
    return next();
  }
};

//user update validate;
const updateValidate = async (req, res, next) => {
  const user = await User.findById(req?.user?._id).lean();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("users/edit-profile", {
      title: `Edit Profile of ${user?.firstName}`,
      errMsg: errors.array()[0].msg,
      userInput: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    });
  } else {
    return next();
  }
};

module.exports = {
  registerValidate,
  loginValidate,
  updateValidate,
};
