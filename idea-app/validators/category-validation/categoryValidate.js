const { validationResult } = require("express-validator");

const categoryValidate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log("error occurs");
    // console.log(errors, "errors");
    return res
      .status(400)
      .json({ success: false, message: errors?.array()[0]?.msg });
  } else {
    return next();
  }
};

module.exports = {
  categoryValidate,
};
