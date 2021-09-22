const { check } = require("express-validator");

const commentValidators = () => {
  return [
    check("title")
      .notEmpty()
      .withMessage("Title is required")
      .bail()
      .isLength({ max: 100 })
      .withMessage("Title is not greater than 100 words")
      .trim(),

    check("text")
      .isLength({ max: 1000 })
      .withMessage("Text is not greater than 1000 words")
      .trim(),
  ];
};

module.exports = {
  commentValidators,
};
