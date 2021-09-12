const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

const { compareValues, trancateContent } = require("./helpers/hbs");

//db connection;
const connectDB = require("./playground/DBConnection.js");

const ideaRoute = require("./route/ideaRoute");
//db connection function call;
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
  return res.render("pages/index", {
    text: "Hello from Node Js",
    title: "Home Page",
  });
});

//about us route;
app.get("/about", (req, res) => {
  return res.render("pages/about", {
    text: "Know as About Us",
    title: "About US",
  });
});

//declear route;
app.use("/ideas", ideaRoute);

app.get("*", (req, res) => {
  return res.render("pages/notFound");
});

app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).render("pages/error", {
    title: "Error",
  });
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
