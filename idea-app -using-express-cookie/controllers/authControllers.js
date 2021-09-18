const User = require("../models/user");
const bcrypt = require("bcryptjs");

//for registration get method
const getRegisterController = (req, res) => {
  res.render("auth/register", {
    title: "Registration",
  });
};

//for login get method
const getLoginController = (req, res) => {
  res.render("auth/login", {
    title: "Login for Idea App",
  });
};

//registration post method
const postRegisterController = async (req, res) => {
  const user = new User({
    ...req.body,
    // allowComments,
  });
  await user.save();
  return res.redirect("/ideas");
  // console.log("Success");
};

//login post method;
const postLoginController = async (req, res) => {
  //check email
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    //check passward
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      console.log("Login Successfully");
      res.cookie("isLoggedIn", "true", {
        maxAge: 8 * 60 * 60 * 1000, // cookie will be removed after 8 hours,
        httpOnly: true,
        sameSite: "lax",
      });
      res.redirect("/ideas");
    } else {
      console.log("Envalid Email and Password");
    }
  } else {
    console.log("Envalid Email and Password");
  }

  //login successfully
  // console.log(req.body, "body");
};

const getLogoutController = (req, res, next) => {
  res.clearCookie("isLoggedIn");
  console.log("Logout Successfully");
  res.redirect("/auth/login");
};

module.exports = {
  getRegisterController,
  postRegisterController,
  getLoginController,
  postLoginController,
  getLogoutController,
};
