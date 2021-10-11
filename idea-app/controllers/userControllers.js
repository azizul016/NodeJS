const User = require("../models/user");
const _ = require("lodash");
const { Category } = require("../models/category");
//image resize;
const sharp = require("sharp");
const fs = require("fs");
const util = require("util");
const deleteFilePromise = util.promisify(fs.unlink);

const nodemailer = require("nodemailer");

//email body requrie;
const {
  emailSendConfig,
  deleteAccountAndSendingEmail,
} = require("../email/account");

let transporter = nodemailer.createTransport(emailSendConfig());

//uuid require;
const { uuidv4 } = require("../middleware/multer/multerConfig");
const uniqueSuffix = Date.now() + "-" + uuidv4();

const getUserController = async (req, res, next) => {
  //   console.log(req, "req");
  const user = await User.findById(req?.user?._id).lean();
  if (user) {
    // console.log(user, "user");
    return res.render("users/profile", {
      title: `Profile of ${user?.firstName}`,
      path: "/users/me",
      user,
    });
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

const editUserController = async (req, res, next) => {
  const user = await User.findById(req?.user?._id).lean();
  if (user) {
    return res.render("users/edit-profile", {
      title: `Profile of ${user?.firstName}`,
      path: "/users/me",
      userInput: user,
    });
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

const updateUserController = async (req, res, next) => {
  const pickedValue = _.pick(req.body, ["firstName", "lastName"]);

  if (req.file) {
    let fileName = uniqueSuffix + req.file.originalname;
    // set uploaded image in db with multer config
    // pickedValue.image = req?.file?.filename;

    //using multer and resize image by using sharp
    sharp(req?.file?.buffer)
      .resize(300, 300)
      .toFile(`./uploads/user/${fileName}`);

    pickedValue.image = fileName;

    if (req?.user?.imageURL) {
      // if you login in google then and try to edit your image then google image detete then upload midify image
      req.user.imageURL = undefined;
      await req.user.save({ validateBeforeSave: false });
    }

    if (req.user.image) {
      // console.log(req.user.image, "image");
      deleteFilePromise(`./uploads/user/${req.user.image}`);
      console.log("image delete successfully");
    }
  }

  console.log(pickedValue, "pickedValue");

  const user = await User.findByIdAndUpdate(req?.user?._id, pickedValue);
  if (user) {
    req.flash("success_msg", "Profile Updated Successfully");
    return res.redirect("/users/me");
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

const getUserIdeasController = async (req, res) => {
  const page = +req?.query?.page || 1;
  const per_page_item = 1;
  //get all categoryes
  const categories = await Category.find().lean();

  const user = await User.findById(req?.params?.id)
    .lean()
    .populate({
      path: "ideas",
      options: {
        sort: {
          createdAt: -1,
        },
      },
      //if you want only title and description field;
      // select:{
      //   title:1,
      //   description:1,
      // }
      // or
      // select : "title description"
    });

  //duplicate check
  // let modifyTagArray = [];
  // for (let i = 0; i < user?.ideas?.length; i++) {
  //   const element = user?.ideas[i]?.tags;
  //   for (let j = 0; j < element.length; j++) {
  //     // console.log(element[j], "element[j]");
  //     let index = modifyTagArray.indexOf(element[j]);
  //     if (index == -1) {
  //       modifyTagArray.push(element[j]);
  //     }
  //   }
  //   // element.map()
  // }
  if (user) {
    // console.log(user, "user");
    const modifyUser = user?.ideas?.filter((idea) => idea.status === "public");

    //pagination start
    const userPublicIdeaCount = modifyUser.length;
    const userPublicIdeaToPass = modifyUser.splice(
      (page - 1) * per_page_item,
      per_page_item
    );

    //pagination end

    // console.log(modifyUser, "modifyUser");

    return res.render("ideas/index", {
      title: `All Ideas By ${user?.firstName}`,
      ideas: userPublicIdeaToPass,
      // ideas: user?.ideas,
      firstName: user?.firstName,
      userRef: true,
      ideaTags: user?.ideas,
      categories: categories,
      //pagination data;
      currentPage: page,
      previousPage: page - 1,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      hasNextPage: page * per_page_item < userPublicIdeaCount,
      lastPage: Math.ceil(userPublicIdeaCount / per_page_item),
      userId: user?._id,
    });
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

//deshboard controller
const deshboardController = async (req, res) => {
  const user = await User.findById(req?.user?._id).populate("ideas").lean();
  // console.log(user, "user");
  if (user) {
    res.render("users/deshboard", {
      title: `All Idea By ${user.firstName}`,
      ideas: user?.ideas,
      path: "/users/me/ideas",
    });
  } else {
    return res.status(404).render("pages/notFound", {
      title: "Not Found Pages",
    });
  }
};

const deleteUserController = async (req, res) => {
  // const user = await User.findByIdAndDelete(req?.user?._id);
  //using schema remove; see schema remove
  const user = await req.user.remove();
  // console.log(user, "removing user");

  if (user.image) {
    // console.log(req.user.image, "image");
    deleteFilePromise(`./uploads/user/${user.image}`);
    console.log("image delete successfully");
  }
  transporter.sendMail(deleteAccountAndSendingEmail(user.email));

  if (user) {
    req.logout();
    //mail send;
    req.flash("success_msg", "Delete Your Account Successfully");
    return res.redirect("/ideas");
  } else {
    req.flash("error_msg", "Something Occurs Cannot Delete Your Account");
    return res.redirect("back");
  }
};

module.exports = {
  getUserController,
  editUserController,
  updateUserController,
  getUserIdeasController,
  deleteUserController,
  deshboardController,
};
