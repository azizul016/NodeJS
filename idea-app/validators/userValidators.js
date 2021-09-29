const { check } = require("express-validator");
const User = require("../models/user");

const reginterValidators = () => {
  return [
    check("firstName")
      .notEmpty()
      .withMessage("First Name is required")
      .bail()
      .isLength({ min: 2, max: 20 })
      .withMessage("First Name must be in 2 to 50 characters")
      .trim(),
    check("lastName")
      .notEmpty()
      .withMessage("Last Name is required")
      .bail()
      .isLength({ min: 2, max: 20 })
      .withMessage("Last Name must be in 2 to 50 characters")
      .trim(),
    check("email")
      .notEmpty()
      .withMessage("Email is Required")
      .bail()
      .trim()
      .isEmail()
      .withMessage("Please Provide Valid Email")
      .bail()
      .normalizeEmail(),
    check("email").custom(async (email) => {
      const findingUser = await User.findOne({ email });
      if (findingUser) {
        throw new Error("Email is Already Reginstered");
      } else {
        return true;
      }
    }),
    check("password")
      .notEmpty()
      .withMessage("Password is Required")
      .bail()
      .isLength({ min: 6, max: 50 })
      .withMessage("Password Must Be at least 6 to 50 characters")
      .bail()
      .not()
      .isIn(["password", "123456", "god123"])
      .withMessage("Password Must not contain common password"),
    check("confirmPassword")
      .notEmpty()
      .withMessage("Confirm Password is Required")
      .bail()
      .custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
  ];
};

//login validator;
const loginValidators = () => {
  return [
    check("email")
      .notEmpty()
      .withMessage("Email is Required")
      .bail()
      .trim()
      .isEmail()
      .withMessage("Please Provide Valid Email")
      .bail()
      .normalizeEmail(),

    check("password").notEmpty().withMessage("Password is Required"),
  ];
};

//update user validator;
const updateUserValidators = () => {
  return [
    check("firstName")
      .notEmpty()
      .withMessage("First Name is required")
      .bail()
      .isLength({ min: 2, max: 20 })
      .withMessage("First Name must be in 2 to 50 characters")
      .trim(),
    check("lastName")
      .notEmpty()
      .withMessage("Last Name is required")
      .bail()
      .isLength({ min: 2, max: 20 })
      .withMessage("Last Name must be in 2 to 50 characters")
      .trim(),
  ];
};

module.exports = {
  reginterValidators,
  loginValidators,
  updateUserValidators,
};
