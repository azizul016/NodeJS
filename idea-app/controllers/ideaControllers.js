const mongoose = require("mongoose");
const _ = require("lodash");

//idea generate doc import
const {
  generateIdeaDoc,
  generateCommentDoc,
} = require("../helpers/docGenarate");
// require model;
const Idea = require("../models/idea");

//get all idea controller
const getIdeaController = async (req, res, next) => {
  const ideas = await Idea.find();
  const contexts = ideas.map((idea) =>
    generateIdeaDoc(
      idea._id,
      idea.title,
      idea.description,
      idea.allowComments,
      idea.status,
      idea.tags
    )
  );
  return res.render("ideas/index", {
    ideas: contexts,
    title: "All Ideas",
  });
};

///show form to add idea controller
const addIdeaController = (req, res, next) => {
  return res.render("ideas/new");
};

//post or add idea controller
const postIdeaController = async (req, res) => {
  try {
    req.body.tags = req?.body?.tags?.split(",");

    const idea = new Idea({
      ...req?.body,
      user: {
        id: req?.user?._id,
        firstName: req?.user?.firstName,
      },
      // allowComments,
    });

    // console.log(idea, "idea");
    await idea?.save();
    //redirect idea
    // console.log("testing purpose");
    req.flash("success_msg", "Idea Added Successfully");
    return res.redirect("/ideas");
  } catch (error) {
    cosole.log(error.message);
  }
};

//show edit idea from controller
const editIdeaController = async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render("pages/notFound");
  }

  const idea = await Idea.findById(id);

  if (idea) {
    const singleIdea = generateIdeaDoc(
      idea._id,
      idea.title,
      idea.description,
      idea.allowComments,
      idea.status,
      idea.tags
    );

    return res.render("ideas/edit", {
      title: "Edit Idea",
      idea: singleIdea,
    });
  } else {
    return res.status(404).render("pages/notFound");
  }
};

//update idea controller
const updateIdeaController = async (req, res, next) => {
  const id = req.params.id;
  req.body.tags = req.body.tags.split(",");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).render("pages/notFound");
  }

  const pickedValue = _.pick(req.body, [
    "title",
    "description",
    "status",
    "allowComments",
    "tags",
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
  const idea = await Idea.findById(id).populate("comments");
  // console.log(idea, "idea");

  if (idea.comments.length > 0) {
    contextComments = idea.comments.map((comment) =>
      generateCommentDoc(
        comment?._id,
        comment?.title,
        comment?.text,
        comment?.user,
        comment?.createdAt
      )
    );
  }

  // console.log(idea, "idea");
  if (idea) {
    const singleIdea = generateIdeaDoc(
      idea._id,
      idea.title,
      idea.description,
      idea.allowComments,
      idea.status,
      idea.tags,
      idea.user,
      idea.createdAt,
      contextComments
    );

    console.log(singleIdea, "singleIdea");

    return res.render("ideas/shows", {
      title: idea.title,
      idea: singleIdea,
      // idea: { ...singleIdea, user: idea?.user },
    });
  } else {
    return res.status(404).render("pages/notFound");
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
};
