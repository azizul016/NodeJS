const { check } = require("express-validator");
const User = require("../models/user");
const imageTotalMineType = [
  "image/webp",
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/avif",
  "image/apng",
];

//registration
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

    check("profilePicture").custom((value, { req }) => {
      const { file } = req;
      if (file) {
        if (imageTotalMineType.includes(file.mimetype)) {
          return true;
        } else {
          throw new Error(`Image file only contains   "webp",
          "svg+xml",
          "png",
          "jpeg",
          "gif",
          "avif",
          "apng", file }`);
        }
      } else {
        return true;
      }
    }),

    check("profilePicture").custom((value, { req }) => {
      const { file } = req;
      if (file.size < 1000000) {
        return true;
      } else {
        throw new Error("File size is not greater then 1000000");
      }
    }),
  ];
};

//forget password validators;
const forgetPasswordValidators = () => {
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
    check("email").custom(async (email) => {
      const findingUser = await User.findOne({ email });
      if (!findingUser) {
        throw new Error("User Not Exist");
      } else {
        return true;
      }
    }),
  ];
};

//reset password validators
const resetPasswordValidators = () => {
  return [
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
    check("confirmpassword")
      .notEmpty()
      .withMessage("Confirm Password is Required")
      .bail()
      .custom((confirmpassword, { req }) => {
        if (confirmpassword !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
  ];
};

module.exports = {
  reginterValidators,
  loginValidators,
  updateUserValidators,
  forgetPasswordValidators,
  resetPasswordValidators,
};
