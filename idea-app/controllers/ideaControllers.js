const mongoose = require("mongoose");
const _ = require("lodash");

//idea generate doc import
const {
  generateIdeaDoc,
  generateCommentDoc,
} = require("../helpers/docGenarate");
// require model;
const Idea = require("../models/idea");

//category model;
const { Category } = require("../models/category");

//get all idea controller
const getIdeaController = async (req, res, next) => {
  //get all ideas;
  const ideas = await Idea.find().lean();

  //filtering only public ideas;
  const filteringPublicIdeas = ideas?.filter(
    (eachIdea) => eachIdea.status === "public"
  );

  // .lean() using for handlebars error problem for solve
  // const ideas = await Idea.find({ status: "public" }).lean();

  //get all categoryes
  const categories = await Category.find().lean();
  // const contexts = ideas.map((idea) =>
  //   generateIdeaDoc(
  //     idea._id,
  //     idea.title,
  //     idea.description,
  //     idea.allowComments,
  //     idea.status,
  //     idea.tags
  //   )
  // );
  // console.log(ideas, "ideas");
  const contexts = filteringPublicIdeas.map((idea) => generateIdeaDoc(idea));
  return res.render("ideas/index", {
    path: "/ideas",
    ideas: contexts,
    ideaTags: ideas,
    categories: categories,
    title: "All Ideas",
  });
};

///show form to add idea controller
const addIdeaController = async (req, res, next) => {
  const categories = await Category.find().lean();
  return res.render("ideas/new", {
    title: "Add Idea",
    path: "/ideas/new",
    categories,
  });
};

//post or add idea controller
const postIdeaController = async (req, res) => {
  try {
    // req.body.tags = req?.body?.tags?.split(",");

    const idea = new Idea({
      ...req?.body,
      user: {
        id: req?.user?._id,
        firstName: req?.user?.firstName,
      },
      categories: [],
      // allowComments,
    });

    if (Array.isArray(req?.body?.categories)) {
      for (let i = 0; i < req?.body?.categories?.length; i++) {
        const categoryName = req?.body?.categories[i];
        idea?.categories?.push({ categoryName });
      }
    } else {
      idea?.categories?.push({ categoryName: req?.body?.categories });
    }

    // console.log(idea, "idea adding");
    await idea?.save();
    //redirect idea
    // console.log("testing purpose");
    req.flash("success_msg", "Idea Added Successfully");
    return res.redirect("/ideas");
  } catch (error) {
    console.log(error.message);
  }
};

//show edit idea from controller
const editIdeaController = async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render("pages/notFound");
  }

  const idea = await Idea.findById(id);
  const categories = await Category.find().lean();

  if (idea) {
    // const singleIdea = generateIdeaDoc(
    //   idea._id,
    //   idea.title,
    //   idea.description,
    //   idea.allowComments,
    //   idea.status,
    //   idea.tags
    // );

    const singleIdea = generateIdeaDoc(idea);

    const ideaCategories = [];

    ///generating array of object (only with matched categories category and idea category)

    singleIdea?.categories?.filter(({ categoryName }) => {
      categories?.map(({ category }) => {
        if (category === categoryName) {
          ideaCategories.push({ category, categoryName });
        }
      });
    });

    //modifying the existing array of object (adding the categories category that is not part of existing array)

    categories?.map((e, i) => {
      if (
        e?.category != (ideaCategories[i] ? ideaCategories[i].category : "")
      ) {
        ideaCategories.push({
          category: e.category,
          categoryName: null,
        });
      }
    });

    //compare two array and finding an unique category array;
    const uniqCatagoryArr = _.uniqBy(ideaCategories, "category");

    console.log(uniqCatagoryArr, "uniqCatagoryArr");

    return res.render("ideas/edit", {
      title: "Edit Idea",
      idea: singleIdea,
      ideaCategories: uniqCatagoryArr,
    });
  } else {
    return res.status(404).render("pages/notFound");
  }
};

//update idea controller
const updateIdeaController = async (req, res, next) => {
  const id = req.params.id;
  let categories = [];
  req.body.tags = req.body.tags.split(",");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render("pages/notFound");
  }

  if (Array.isArray(req?.body?.categories)) {
    for (let i = 0; i < req?.body?.categories?.length; i++) {
      const categoryName = req?.body?.categories[i];
      categories?.push({ categoryName });
    }
  } else {
    categories?.push({ categoryName: req?.body?.categories });
  }

  req.body.categories = categories;

  const pickedValue = _.pick(req.body, [
    "title",
    "description",
    "status",
    "allowComments",
    "tags",
    "categories",
  ]);

  const updatedIdea = await Idea.findByIdAndUpdate(id, pickedValue);
  if (updatedIdea) {
    req.flash("success_msg", "Idea Updated Successfully");
    //redirect;
    return res.redirect(`/ideas/${id}`);
  } else {
    return res.status(404).render("pages/notFound");
  }
};

//delete idea controller
const deleteIdeaController = async (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render("pages/notFound");
  }
  const idea = await Idea.findByIdAndDelete(id);
  if (idea) {
    req.flash("success_msg", "Idea Delete Successfully");
    //redirect route
    return res.redirect("/ideas");
  } else {
    return res.status(404).render("pages/notFound");
  }
};

//get single Idea controller
const getSingleIdeaController = async (req, res, next) => {
  const id = req.params.id;
  let contextComments;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render("pages/notFound");
  }

  // .lean() using for handlebars error problem for solve
  const idea = await Idea.findById(id).lean().populate("comments");
  // console.log(idea, "idea");

  // if (idea?.comments?.length > 0) {
  //   contextComments = idea.comments.map((comment) =>
  //     generateCommentDoc(
  //       comment?._id,
  //       comment?.title,
  //       comment?.text,
  //       comment?.user,
  //       comment?.createdAt
  //     )
  //   );
  // }
  if (idea?.comments?.length > 0) {
    contextComments = idea.comments.map((comment) =>
      generateCommentDoc(comment)
    );
  }

  // console.log(idea, "idea");
  if (idea) {
    // const singleIdea = generateIdeaDoc(
    //   idea._id,
    //   idea.title,
    //   idea.description,
    //   idea.allowComments,
    //   idea.status,
    //   idea.tags,
    //   idea.user,
    //   idea.createdAt,
    //   contextComments
    // );
    const singleIdea = generateIdeaDoc(idea);
    singleIdea.comments = contextComments;

    // console.log(singleIdea, "singleIdea");

    return res.render("ideas/shows", {
      title: singleIdea.title,
      // title: idea.title,
      idea: singleIdea,
      // idea: { ...singleIdea, user: idea?.user },
    });
  } else {
    return res.status(404).render("pages/notFound");
  }
};

//add like and remove like controller;
const postLikeController = async (req, res, next) => {
  const id = req.params.id;
  const userId = req.body.userId;

  const idea = await Idea.findById(id);
  if (idea) {
    if (!idea?.likes?.includes(userId)) {
      idea?.likes?.push(userId);
      await idea.save();
      return res.send({
        success: true,
        message: "You Liked The Idea",
      });
    } else {
      const likes = idea?.likes?.filter(
        (like) => like?.toString() !== userId?.toString()
      );
      idea.likes = likes;
      await idea.save();
      return res.send({
        success: true,
        message: "You liked is removed the idea",
      });
    }
  } else {
    return res
      .status(404)
      .send({ success: false, message: "Your idea is not like by this user" });
  }
};

//like count controller;
const getLikeCountController = async (req, res, next) => {
  // console.log(req?.params?.id, "params id");

  const id = req?.params?.id;

  const idea = await Idea.findById(id);

  // console.log(idea, "idea");

  if (idea) {
    let likeCount = idea?.likes?.length;
    return res.status(200).send({ success: true, data: likeCount });
  } else {
    return res.status(404).send({
      success: false,
      message: "Your Idea is not found to be get counted",
    });
  }
};
//comment count controller;
const getCommentCountController = async (req, res, next) => {
  const id = req?.params?.id;
  const idea = await Idea.findById(id).populate("comments").lean();
  if (idea) {
    let commentCount = idea?.comments?.length || 0;
    return res.status(200).send({ success: true, data: commentCount });
  } else {
    return res.status(404).send({
      success: false,
      message: "Your Idea is not found to be get counted",
    });
  }
};

module.exports = {
  getIdeaController,
  addIdeaController,
  postIdeaController,
  editIdeaController,
  updateIdeaController,
  deleteIdeaController,
  getSingleIdeaController,
  postLikeController,
  getLikeCountController,
  getCommentCountController,
};
