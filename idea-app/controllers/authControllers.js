const User = require("../models/user");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

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

  const pickedValue = _.pick(req.body, [
    "firstName",
    "lastName",
    "email",
    "password",
  ]);

  // console.log(pickedValue, "pickedValue");

  // const pickedValue = _.pick(req?.body, [
  //   "firstName",
  //   "lastName",
  //   "email",
  //   "password",
  // ]);

  const user = new User({
    // ...req.body,
    // allowComments,
    ...pickedValue,
  });
  // console.log(user, "user");
  await user.save();
  req.flash("success_msg", "Registration Successfully");
  return res.redirect("/auth/login");
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

module.exports = {
  getRegisterController,
  postRegisterController,
  getLoginController,
  postLoginController,
  getLogoutController,
  getGoogleController,
};
