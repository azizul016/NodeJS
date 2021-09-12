const express = require("express");
const exphbs = require("express-handlebars");
const _ = require("lodash");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");

const { compareValues, trancateContent } = require("./helpers/hbs");

// require model;
const Idea = require("./models/ideas");

function generateIdeaDoc(id, title, description, allowComments, status) {
  return {
    id,
    title,
    description,
    allowComments,
    status,
  };
}

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ideas-app");
    console.log("Datebase Is Connected Successfully");
  } catch (error) {
    console.log(error);
  }
}
connectDB();

const app = express();

//express handlebars engine diclear
app.engine(
  ".hbs",
  exphbs({ extname: ".hbs", helpers: { compareValues, trancateContent } })
);
app.set("view engine", ".hbs");

//middleware
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));

//home page route
app.get("/", (req, res) => {
  return res.render("index", {
    text: "Hello from Node Js",
    title: "Home Page",
  });
});

//get all ideas
app.get("/ideas", async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
    return res.status(500).render("error", {
      title: "Error",
    });
  }
});

//show form to add idea;
app.get("/ideas/new", (req, res) => {
  return res.render("ideas/new");
});

//add idea;
app.post(
  "/ideas",
  [
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
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const allowComments = req.body.allowComments ? true : false;
    if (!errors.isEmpty()) {
      return res.status(400).render("ideas/new", {
        title: "Add Idea",
        errMsg: errors.array()[0].msg,
        idea: {
          title: req.body.title,
          description: req.body.description,
          allowComments,
          status: req.body.status,
        },
      });
    }

    // console.log(errors.array());

    try {
      const idea = new Idea({
        ...req.body,
        allowComments,
      });
      await idea.save();
      //redirect idea
      return res.redirect("/ideas");
    } catch (error) {
      for (field in error.errors) {
        console.log(error.errors[field].path, error.errors[field].message);
      }
      // console.log(error);
      return res.status(500).render("error", {
        title: "Error",
      });
    }
  }
);

//show edit idea from;
app.get("/ideas/:id/edit", async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).render("notFound");
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
      return res.status(404).render("notFound");
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).render("error", {
      title: "Error",
    });
  }
});

//update ideas
app.put(
  "/ideas/:id",
  [
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
  ],
  async (req, res) => {
    try {
      const id = req.params.id;
      // if (!mongoose.Types.ObjectId.isValid(id)) {
      //   return res.status(400).render("notFound");
      // }
      const allowComments = req.body.allowComments ? true : false;
      req.body.allowComments = allowComments;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("ideas/edit", {
          title: "Edit Idea",
          errMsg: errors.array()[0].msg,
          idea: {
            id: id,
            title: req.body.title,
            description: req.body.description,
            allowComments,
            status: req.body.status,
          },
        });
      }

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
        return res.status(404).render("notFound");
      }
    } catch (error) {
      // console.log(error.message);
      return res.status(500).render("error", {
        title: "Error",
      });
    }
  }
);

//delete route;
app.delete("/ideas/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).render("notFound");
    }
    const idea = await Idea.findByIdAndDelete(id);
    if (idea) {
      //redirect route
      return res.redirect("/ideas");
    } else {
      return res.status(404).render("notFound");
    }
  } catch (error) {
    return res.status(500).render("error", {
      title: "Error",
    });
  }
});

//get single idea
app.get("/ideas/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).render("notFound");
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
      return res.status(404).render("notFound");
    }
  } catch (error) {
    // console.log(error.message);
    return res.status(500).render("error", {
      title: "Error",
    });
  }
});

//about us route;
app.get("/about", (req, res) => {
  return res.render("about", {
    text: "Know as About Us",
    title: "About US",
  });
});

app.get("*", (req, res) => {
  return res.render("notFound");
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
