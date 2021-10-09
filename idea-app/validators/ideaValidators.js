const { check } = require("express-validator");
const imageTotalMineType = [
  "image/webp",
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/avif",
  "image/apng",
];

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
    check("tags", "Idea Must Have One Tags").trim().isLength({ min: 1 }),

    check("ideaPicture").custom((value, { req }) => {
      const { file } = req;
      // console.log(file, "file");
      if (file) {
        if (imageTotalMineType.includes(file.mimetype)) {
          return true;
        } else {
          throw new Error(
            `Image file only contains   "webp", "svg+xml", "png", "jpeg", "gif","avif","apng", file }`
          );
        }
      } else {
        return true;
      }
    }),

    check("ideaPicture").custom((value, { req }) => {
      const { file } = req;
      if (file.size < 5242880) {
        return true;
      } else {
        throw new Error("File size is not greater then 5md");
      }
    }),
  ];
};

module.exports = {
  ideaValidators,
};
