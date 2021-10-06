const User = require("../models/user");
const _ = require("lodash");
const { Category } = require("../models/category");

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

const getUserIdeasController = async (req, res) => {
  //get all categoryes
  const categories = await Category.find().lean();

  const user = await User.findById(req?.params?.id).populate("ideas").lean();

  //duplicate check
  // let modifyTagArray = [];
  // for (let i = 0; i < user?.ideas?.length; i++) {
  //   const element = user?.ideas[i]?.tags;
  //   for (let j = 0; j < element.length; j++) {
  //     // console.log(element[j], "element[j]");
  //     let index = modifyTagArray.indexOf(element[j]);
  //     if (index == -1) {
  //       modifyTagArray.push(element[j]);
  //     }
  //   }
  //   // element.map()
  // }

  // console.log(user, "user");
  const modifyUser = user?.ideas?.filter((idea) => idea.status === "public");
  // console.log(modifyUser, "modifyUser");
  if (user) {
    return res.render("ideas/index", {
      title: `All Ideas By ${user?.firstName}`,
      ideas: modifyUser,
      // ideas: user?.ideas,
      firstName: user?.firstName,
      userRef: true,
      ideaTags: user?.ideas,
      categories: categories,
    });
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

//deshboard controller
const deshboardController = async (req, res) => {
  const user = await User.findById(req?.user?._id).populate("ideas").lean();
  // console.log(user, "user");
  if (user) {
    res.render("users/deshboard", {
      title: `All Idea By ${user.firstName}`,
      ideas: user?.ideas,
      path: "/users/me/ideas",
    });
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

const deleteUserController = async (req, res) => {
  // const user = await User.findByIdAndDelete(req?.user?._id);
  //using schema remove; see schema remove
  const user = req.user.remove();

  // console.log(user, "removing user");

  if (user) {
    req.logout();
    req.flash("success_msg", "Delete Your Account Successfully");
    return res.redirect("/ideas");
  } else {
    req.flash("error_msg", "Something Occurs Cannot Delete Your Account");
    return res.redirect("back");
  }
};

module.exports = {
  getUserController,
  editUserController,
  updateUserController,
  getUserIdeasController,
  deleteUserController,
  deshboardController,
};
