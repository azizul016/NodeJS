const { validationResult } = require("express-validator");

const updateIdeaValidators = (req, res, next) => {
  const id = req.params.id;
  const allowComments = req.body.allowComments ? true : false;
  req.body.allowComments = allowComments;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors, "error");
    return res.status(400).render("ideas/edit", {
      title: "Edit Idea",
      errMsg: errors.array()[0].msg,
      idea: {
        _id: id,
        title: req.body.title,
        description: req.body.description,
        allowComments,
        status: req.body.status,
        tags: req.body.tags,
      },
    });
  } else {
    console.log("problem");
    return next();
  }
};

module.exports = { updateIdeaValidators };
