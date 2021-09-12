const { validationResult } = require("express-validator");

const updateIdeaValidators = (req, res, next) => {
  const allowComments = req.body.allowComments ? true : false;
  req.body.allowComments = allowComments;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("ideas/edit", {
      title: "Edit Idea",
      errMsg: errors.array()[0].msg,
      idea: {
        id: id,
        title: req.body.title,
        description: req.body.description,
        allowComments,
        status: req.body.status,
      },
    });
  } else {
    return next();
  }
};

module.exports = { updateIdeaValidators };
