const express = require("express");
const exphbs = require("express-handlebars");
const _ = require("lodash");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const MongoStore = require("connect-mongo");

const { compareValues, trancateContent } = require("./helpers/hbs");

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

let ideas = [
  {
    id: 1,
    title: "Idea 1",
    description: "Descripton 1",
    allowComments: true,
    status: "public",
  },
  {
    id: 2,
    title: "Idea 2",
    description: "Descripton 2",
    allowComments: false,
    status: "private",
  },
  {
    id: 3,
    title: "Idea 3",
    description: "Descripton 3",
    allowComments: true,
    status: "public",
  },
];

//home page route
app.get("/", (req, res) => {
  res.render("index", {
    text: "Hello from Node Js",
    title: "Home Page",
  });
});

//get all ideas
app.get("/ideas", (req, res) => {
  res.render("ideas/index", {
    ideas,
    title: "All Ideas",
  });
});

//show form to add idea;
app.get("/ideas/new", (req, res) => {
  res.render("ideas/new");
});

//add idea;
app.post("/ideas", (req, res) => {
  const allowComments = req.body.allowComments ? true : false;
  const idea = {
    ...req.body,
    allowComments: allowComments,
    id: ideas.length + 1,
  };
  // add idea
  ideas.push(idea);
  //redirect idea
  res.redirect("/ideas");
});

//show edit idea from;
app.get("/ideas/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const idea = ideas.find((idea) => idea.id === id);
  if (idea) {
    res.render("ideas/edit", {
      title: "Edit Idea",
      idea,
    });
  } else {
    res.render("notFound");
  }
});

//update ideas
app.put("/ideas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pickedValue = _.pick(req.body, [
    "title",
    "description",
    "status",
    "allowComments",
  ]);
  const idea = ideas.find((idea) => idea.id === id);
  if (idea) {
    const ideaToUpdate = {
      id,
      ...pickedValue,
    };
    //update idea;
    ideas = ideas.map((idea) =>
      idea.id === id ? (idea = ideaToUpdate) : idea
    );
    //redirect;
    res.redirect(`/ideas/${id}`);
  } else {
    res.render("notFound");
  }
});

//delete route;
app.delete("/ideas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const idea = ideas.find((idea) => idea.id === id);
  if (idea) {
    //remove idea;
    ideas = ideas.filter((idea) => idea.id !== id);
    res.redirect("/ideas");
  } else {
    res.render("notFound");
  }
});

//get single idea
app.get("/ideas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  //finding idea from ideas array;
  const idea = ideas.find((idea) => idea.id === id);
  if (idea) {
    res.render("ideas/shows", {
      title: "Single Idea",
      idea,
    });
  } else {
    res.render("notFound");
  }
});

//about us route;
app.get("/about", (req, res) => {
  res.render("about", {
    text: "Know as About Us",
    title: "About US",
  });
});

app.get("*", (req, res) => {
  res.render("notFound");
});

app.listen(4000, () => {
  console.log("Server is listening on port 3000");
});
