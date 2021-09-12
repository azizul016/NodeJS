const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");

const { check, validationResult } = require("express-validator");

//idea generate doc import
const generateIdeaDoc = require("../helpers/docGenarate");
// require model;
const Idea = require("../models/idea");

//validator import;
const { addIdeaValidate } = require("../validators/addIdeaValidators");
const { updateIdeaValidators } = require("../validators/updateIdeaValidators");
const { ideaValidators } = require("../validators/ideaValidators");

//middleware import;
const asyncMiddleware = require("../middleware/asyncMiddleware");

//get all ideas
//using asyncMiddleWare for  remove try catch block. Now try catch block in manage from one folder and folder name is middleware/asyncMiddleware
router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    const ideas = await Idea.find();
    const contexts = ideas.map((idea) =>
      generateIdeaDoc(
        idea._id,
        idea.title,
        idea.description,
        idea.allowComments,
        idea.status
      )
    );
    return res.render("ideas/index", {
      ideas: contexts,
      title: "All Ideas",
    });
  })
);

//show form to add idea;
router.get("/new", (req, res, next) => {
  return res.render("ideas/new");
});

//add idea;
router.post("/", ideaValidators(), addIdeaValidate, async (req, res) => {
  // console.log(errors.array());

  try {
    const idea = new Idea({
      ...req.body,
      // allowComments,
    });
    await idea.save();
    //redirect idea
    return res.redirect("/ideas");
  } catch (error) {
    console.log(error);
    for (field in error.errors) {
      console.log(error.errors[field].path, error.errors[field].message);
    }
    // console.log(error);
    // return res.status(500).render("pages/error", {
    //   title: "Error",
    // });
    next(error);
  }
});

//show edit idea from;
router.get("/:id/edit", async (req, res, next) => {
  try {
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
        idea.status
      );
      return res.render("ideas/edit", {
        title: "Edit Idea",
        idea: singleIdea,
      });
    } else {
      return res.status(404).render("pages/notFound");
    }
  } catch (error) {
    // console.log(error.message);
    // return res.status(500).render("pages/error", {
    //   title: "Error",
    // });
    next(error);
  }
});

//update ideas
router.put(
  "/:id",
  ideaValidators(),
  updateIdeaValidators,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      // if (!mongoose.Types.ObjectId.isValid(id)) {
      //   return res.status(400).render("notFound");
      // }

      const pickedValue = _.pick(req.body, [
        "title",
        "description",
        "status",
        "allowComments",
      ]);

      const updatedIdea = await Idea.findByIdAndUpdate(id, pickedValue);
      if (updatedIdea) {
        //redirect;
        return res.redirect(`/ideas/${id}`);
      } else {
        return res.status(404).render("pages/notFound");
      }
    } catch (error) {
      // console.log(error.message);
      // return res.status(500).render("pages/error", {
      //   title: "Error",
      // });
      next(error);
    }
  }
);

//delete route;
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).render("pages/notFound");
    }
    const idea = await Idea.findByIdAndDelete(id);
    if (idea) {
      //redirect route
      return res.redirect("/ideas");
    } else {
      return res.status(404).render("pages/notFound");
    }
  } catch (error) {
    // return res.status(500).render("pages/error", {
    //   title: "Error",
    // });
    next(error);
  }
});

//get single idea
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).render("pages/notFound");
    }
    const idea = await Idea.findById(id);
    // console.log(idea, "idea");

    // console.log(singleIdea, "singleIdea");
    if (idea) {
      const singleIdea = generateIdeaDoc(
        idea._id,
        idea.title,
        idea.description,
        idea.allowComments,
        idea.status
      );
      return res.render("ideas/shows", {
        title: idea.title,
        idea: singleIdea,
      });
    } else {
      return res.status(404).render("pages/notFound");
    }
  } catch (error) {
    // console.log(error.message);
    // return res.status(500).render("pages/error", {
    //   title: "Error",
    // });
    next(error);
  }
});

module.exports = router;
