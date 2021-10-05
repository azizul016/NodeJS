const { check } = require("express-validator");
const { Category } = require("../../models/category");

const categoryValidators = () => {
  return [
    check("category")
      .notEmpty()
      .withMessage("Category is required")
      .bail()
      .isLength({ max: 15 })
      .withMessage("Category is not greater than 15 words")
      .trim(),

    check("category").custom(async (category) => {
      const findingCategory = await Category.findOne({ category });
      if (findingCategory) throw new Error("Category Already Added");
      return true;
    }),
  ];
};

module.exports = {
  categoryValidators,
};
