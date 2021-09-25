const { validationResult } = require("express-validator");

const addIdeaValidate = (req, res, next) => {
  const errors = validationResult(req);
  const allowComments = req.body.allowComments ? true : false;
  req.body.allowComments = allowComments;

  // console.log(errors?.array());

  if (!errors.isEmpty()) {
    return res.status(400).render("ideas/new", {
      title: "Add Idea",
      errMsg: errors.array()[0].msg,
      idea: {
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

module.exports = {
  addIdeaValidate,
};
