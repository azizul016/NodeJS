const { check } = require("express-validator");

const ideaValidators = () => {
  return [
    check("title")
      .notEmpty()
      .withMessage("title is required")
      .bail()
      .isLength({ min: 2, max: 50 })
      .withMessage("title must be in 2 to 50 characters")
      .trim(),

    check("description")
      .isLength({ max: 1000 })
      .withMessage("description is not greater than 1000 words"),
    check("status")
      .notEmpty()
      .withMessage("status is required")
      .bail()
      .isIn(["public", "private"])
      .withMessage("status must be public or private")
      .trim(),
  ];
};

module.exports = {
  ideaValidators,
};
