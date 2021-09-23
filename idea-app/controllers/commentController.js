const Idea = require("../models/idea");
const { generateIdeaDoc } = require("../helpers/docGenarate");
const { Comment } = require("../models/comment");

//get comment page for add comment controller
const addCommentController = async (req, res, next) => {
  // console.log(req.params.id);
  const idea = await Idea.findById(req.params.id);
  const generateIdeaDocument = generateIdeaDoc(idea?._id, idea?.title);
  if (idea) {
    return res.render("comments/new", {
      title: "Add a Comment",
      idea: generateIdeaDocument,
    });
  } else {
    return res.status(404).render("pages/notFound", { title: "Not Found" });
  }
};

//post comment controller
const postCommentController = async (req, res, next) => {
  const id = req.params.id;
  const idea = await Idea.findById(id);
  // console.log(idea, "fadsfadfad");
  if (idea) {
    // not objectID reference
    // idea.comments.push(req.body);
    // await idea.save();

    //reference object id
    // const comment = new Comment({ ...req.body, idea: idea?._id });
    // await comment.save();
    // idea.comments.push(comment);
    // await idea.save();

    //using vertirual
    // const comment = new Comment({ ...req.body, idea: idea });
    const comment = new Comment({ ...req.body, idea: idea?._id });
    await comment.save();

    return res.redirect(`/ideas/${id}`);
  } else {
    return res.status(404).render("pages/notFound", { title: "Not Found" });
  }
};

//delete comment controller;
const deleteCommentController = async (req, res) => {
  const id = req.params.id;
  const comment_id = req.params.comment_id;
  const idea = await Idea.findById(id);
  if (idea) {
    //for reference object Id
    // const comments = idea.comments.filter(
    //   (comment) => comment?._id?.toString() !== comment_id
    // );
    // idea.comments = comments;
    // await idea.save();

    const findingAndRemoveComments = await Comment.findByIdAndDelete(
      comment_id
    );

    if (findingAndRemoveComments) {
      req.flash("success_msg", "Comments Delete Successfully");
      //redirect route
      return res.redirect(`/ideas/${id}`);
    } else {
      return res.status(404).render("pages/notFound");
    }
  } else {
    return res.status(404).render("pages/notFound", { title: "Not Found" });
  }
};

module.exports = {
  addCommentController,
  postCommentController,
  deleteCommentController,
};
