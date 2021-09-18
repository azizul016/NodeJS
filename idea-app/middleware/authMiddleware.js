const isAuth = (req, res, next) => {
  if (req.session.isLoggedIn === "true") {
    next();
  } else {
    res.redirect("/auth/login");
  }
};

module.exports = { isAuth };
