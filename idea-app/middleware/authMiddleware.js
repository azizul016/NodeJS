//using session and normal auth
// const isAuth = (req, res, next) => {
//   console.log(req.session, "session");
//   if (req.session.isLoggedIn === "true") {
//     next();
//   } else {
//     res.redirect("/auth/login");
//   }
// };

// using passport for is auth authentication
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  } else {
    req.flash("error_msg", "Please Login To Perform This Action");
    return res.redirect("/auth/login");
  }
};

module.exports = { isAuth };
