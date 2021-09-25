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

const Idea = require("../models/idea");
const { Comment } = require("../models/comment");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  } else {
    req.flash("error_msg", "Please Login To Perform This Action");
    return res.redirect("/auth/login");
  }
};

//check idea owner ship.
const checkIdeaOwnership = async (req, res, next) => {
  const id = req.params.id;
  const idea = await Idea.findById(id);
  if (idea) {
    if (idea?.user?.id.equals(req?.user?._id)) {
      // if (idea?.user?.id?.toString() === req?.user?._id?.toString()) {
      next();
      return;
    } else {
      req.flash("error_msg", "You are not allowed for perform this action");
      res.redirect("back");
      return;
    }
  } else {
    req.flash("error_msg", "Idea not found");
    res.redirect("back");
  }
};

//check comment owner ship
const checkCommentOwnership = async (req, res, next) => {
  const id = req.params.comment_id;
  const comment = await Comment.findById(id);
  if (comment) {
    if (comment?.user?.id.equals(req?.user?._id)) {
      // if (idea?.user?.id?.toString() === req?.user?._id?.toString()) {
      next();
      return;
    } else {
      req.flash("error_msg", "You are not allowed for perform this action");
      res.redirect("back");
      return;
    }
  } else {
    req.flash("error_msg", "Comment not found");
    res.redirect("back");
  }
};

module.exports = { isAuth, checkIdeaOwnership, checkCommentOwnership };
