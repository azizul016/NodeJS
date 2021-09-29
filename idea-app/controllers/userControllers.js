const User = require("../models/user");
const _ = require("lodash");

const getUserController = async (req, res, next) => {
  //   console.log(req, "req");
  const user = await User.findById(req?.user?._id).lean();
  if (user) {
    // console.log(user, "user");
    return res.render("users/profile", {
      title: `Profile of ${user?.firstName}`,
      path: "/users/me",
      user,
    });
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

const editUserController = async (req, res, next) => {
  const user = await User.findById(req?.user?._id).lean();
  if (user) {
    return res.render("users/edit-profile", {
      title: `Profile of ${user?.firstName}`,
      path: "/users/me",
      userInput: user,
    });
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

const updateUserController = async (req, res, next) => {
  const pickedValue = _.pick(req.body, ["firstName", "lastName"]);
  const user = await User.findByIdAndUpdate(req?.user?._id, pickedValue);
  if (user) {
    req.flash("success_msg", "Profile Updated Successfully");
    return res.redirect("/users/me");
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

module.exports = {
  getUserController,
  editUserController,
  updateUserController,
};
