const multer = require("multer");
// const upload = multer({ dest: 'uploads/' })

const { v4: uuidv4 } = require("uuid");

//using middle ware in multer;
const imageTotalMineType = [
  "image/webp",
  "image/svg+xml",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/avif",
  "image/apng",
];

// const imageUpload = multer({ dest: "./uploads" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + uuidv4();
    // console.log(uniqueSuffix, "uniquesuffix");
    cb(null, uniqueSuffix + file.originalname);
  },
});
function fileFilter(req, file, cb) {
  // if (file.mimetype) {
  if (imageTotalMineType.includes(file.mimetype)) {
    //accept image
    cb(null, true);
    // return;
  } else {
    //   reject image
    cb(null, false);

    // You can always pass an error if something goes wrong:
    // cb(new Error("Image is not supported By this formet"), false);
  }
}

const imageUpload = multer({
  // storage,
  // fileFilter,
  // limits: {
  //   fileSize: 1000000, //MB to BITEs
  // },
}).single("profilePicture");

const ideaImageUpload = multer({
  // storage,
  // fileFilter,
  // limits: {
  //   fileSize: 1000000, //MB to BITEs
  // },
}).single("ideaPicture");

module.exports = { imageUpload, uuidv4, ideaImageUpload };
