const User = require("../models/user");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

//jwt secret key required;
const { jwtScrectKey, forgetPasswordJWTToken } = require("../config/key");

//email body requrie;
const {
  emailSendConfig,
  registrationEmail,
  forgetPasswordEmail,
} = require("../email/account");

let transporter = nodemailer.createTransport(emailSendConfig());

//for registration get method
const getRegisterController = (req, res) => {
  res.render("auth/register", {
    title: "Registration",
    path: "/auth/register",
  });
};

//for login get method
const getLoginController = (req, res) => {
  res.render("auth/login", {
    title: "Login for Idea App",
    path: "/auth/login",
  });
};

//registration post method
const postRegisterController = async (req, res) => {
  // console.log(req.body, "req.body");

  // const pickedValue = _.pick(req.body, [
  //   "firstName",
  //   "lastName",
  //   "email",
  //   "password",
  // ]);

  // console.log(pickedValue, "pickedValue");

  // const pickedValue = _.pick(req?.body, [
  //   "firstName",
  //   "lastName",
  //   "email",
  //   "password",
  // ]);

  // const user = new User({
  //   // ...req.body,
  //   // allowComments,
  //   ...pickedValue,
  // });
  // console.log(user, "user");
  // await user.save();

  //using jwt token;
  const { firstName, lastName, email, password } = req?.body;

  const token = jwt.sign(
    {
      firstName,
      lastName,
      email,
      password,
    },
    jwtScrectKey,
    { expiresIn: 5 * 60 }
  );
  // console.log(token, "token");
  //mail send;
  transporter.sendMail(registrationEmail(email, token));
  // console.log("successfully email send");

  req.flash("success_msg", "Send Main.Please Active Your Account");
  return res.redirect("/auth/register");
  // console.log("Success");
};

//login post method;
// const postLoginController = async (req, res) => {
//   //check email
//   const user = await User.findOne({ email: req.body.email });
//   if (user) {
//     //check passward
//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (isMatch) {
//       console.log("Login Successfully");

//       //for cookies
//       // res.cookie("isLoggedIn", "true", {
//       //   maxAge: 8 * 60 * 60 * 1000, // cookie will be removed after 8 hours,
//       //   httpOnly: true,
//       //   sameSite: "lax",
//       // });

//       //for session;
//       req.session.isLoggedIn = "true";
//       req.session.user = user;

//       res.redirect("/ideas");
//     } else {
//       console.log("Envalid Email and Password");
//     }
//   } else {
//     console.log("Envalid Email and Password");
//   }

//using passport
const postLoginController = async (req, res) => {
  // console.log("Login Successfully");
  req.flash("success_msg", "Login Successfully");
  // console.log(req.user);
  res.redirect("/ideas");
};

const getLogoutController = (req, res, next) => {
  //for cookies
  // res.clearCookie("isLoggedIn");

  //for session;
  // req.session.destroy();

  //for passport;
  req.logout();
  req.flash("success_msg", "Logout Successfully");
  // console.log("Logout Successfully");
  res.redirect("/auth/login");
};

//google login controllers
const getGoogleController = (req, res) => {
  // console.log("something happend");
  // Successful authentication, redirect home.
  // console.log(req?.user);
  req.flash("success_msg", "Google Login Successfully");
  res.redirect("/ideas");
  return;
};

//account activation controller ;
const accountActivationController = (req, res) => {
  const token = req?.params?.token;
  // console.log(token, "token");
  jwt.verify(token, jwtScrectKey, async function (err, decoded) {
    if (err) {
      req.flash("error_msg", "Account Activation Failed. Please Try Again.");
      return res.redirect("/auth/register");
    }
    const { firstName, lastName, email, password } = decoded;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      req.flash("error_msg", "Account Already Activation Please Log in.");
      return res.redirect("/auth/login");
    } else {
      const user = new User({ firstName, lastName, email, password });
      await user.save();
      req.flash("success_msg", "Account  Activaed. Please Log in.");
      return res.redirect("/auth/login");
    }
  });
};

//get forget password controller;
const getForgetPasswordController = (req, res) => {
  res.render("auth/forget-password", {
    title: "Forget Password",
  });
};

//post forget password controller;
const postForgotPasswordController = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email });

  //token generate;
  const token = jwt.sign(
    {
      email,
    },
    forgetPasswordJWTToken,
    { expiresIn: 5 * 60 }
  );

  //db store token;
  user.resetPasswardToken = token;
  user.save({ validateBeforeSave: false });
  transporter.sendMail(forgetPasswordEmail(email, token));
  req.flash("success_msg", "Send mail for reset your account password");
  return res.redirect("/auth/forget-password");
};

//reset password controller;
const getResetPasswordController = async (req, res) => {
  // console.log("somethin happend");
  const token = req.params.token;
  jwt.verify(token, forgetPasswordJWTToken, async function (err, decoded) {
    if (err) {
      req.flash("error_msg", "Forget Password Failed. Please Try Again.");
      return res.redirect("/auth/forget-password");
    }
    const { email } = decoded;
    const foundUser = await User.findOne({ email, resetPasswardToken: token });
    if (foundUser) {
      return res.render("auth/reset-password", {
        title: "Reset Password",
        token: token,
        email: email,
      });
    } else {
      req.flash("error_msg", "Forget Password Failed. Please Try Again.");
      return res.redirect("/auth/forget-password");
    }
  });
};

//post reset password controller;
const postResetPasswordController = async (req, res) => {
  // console.log(req?.body, "body");
  const { email, token, password } = req?.body;
  jwt.verify(token, forgetPasswordJWTToken, async function (err, decoded) {
    if (err) {
      req.flash("error_msg", "Forget Password Failed. Please Try Again.");
      return res.redirect("/auth/forget-password");
    }
    const foundUser = await User.findOne({ email, resetPasswardToken: token });
    if (foundUser) {
      foundUser.password = password;
      foundUser.resetPasswardToken = undefined;
      await foundUser.save();
      req.flash(
        "success_msg",
        "Password Forget Successful. Please Login Your new Password"
      );
      return res.redirect("/auth/login");
    } else {
      req.flash("error_msg", "Forget Password Failed. Please Try Again.");
      return res.redirect("/auth/forget-password");
    }
  });
};

module.exports = {
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
};
