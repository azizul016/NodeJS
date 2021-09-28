const User = require("../models/user");

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

module.exports = { getUserController };
