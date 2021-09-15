const express = require("express");
require("express-async-errors");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");

const { compareValues, trancateContent } = require("./helpers/hbs");

//db connection;
const connectDB = require("./playground/DBConnection.js");

//route import;
const ideaRoute = require("./route/ideaRoute");
const pageRoute = require("./route/pageRoute");
const authRoute = require("./route/authRoute");

// error middleware import

const { errorMiddleware } = require("./middleware/errorMiddleware");

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

//route declear ;
app.use("/auth", authRoute);
app.use("/ideas", ideaRoute);
app.use(pageRoute);

//error middleware handling
app.use(errorMiddleware);

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
