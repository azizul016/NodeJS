const { validationResult } = require("express-validator");
const Idea = require("../../models/idea");
const { generateIdeaDoc } = require("../../helpers/docGenarate");

const commentValidate = async (req, res, next) => {
  const errors = validationResult(req);
  const idea = await Idea.findById(req.params.id);
  if (idea) {
    const ideaDocuments = generateIdeaDoc(idea._id, idea.title);
    if (!errors.isEmpty()) {
      return res.status(400).render("comments/new", {
        title: "Add Comment",
        errMsg: errors.array()[0].msg,
        idea: ideaDocuments,
      });
    } else {
      return next();
    }
  }
  return next();
};

module.exports = {
  commentValidate,
};
