const express = require("express");
//.env file config  if file is contain another file
// require("dotenv").config({ path: "./config/keys.env" });
//using main file;
require("dotenv").config();
require("express-async-errors");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
// const morgan = require("morgan");
const path = require("path");
//for cookies
// const cookieParser = require("cookie-parser");\
const session = require("express-session");
//session connect mongoDB
const MongoStore = require("connect-mongo");
//passport
const passport = require("passport");
//connect flash for show message;
const flash = require("connect-flash");

//configuration passport
//localStrategy decliear
require("./passportAuth/passport").localStrategy(passport);
require("./passportAuth/passport").googleStrategy(passport);

const {
  compareValues,
  trancateContent,
  displayBtn,
  formatDate,
  comparePath,
  // compareValues,
} = require("./helpers/hbs");

//jwt token secrect key required;
const { secretSession } = require("./config/key");

//db connection;
const { connectDB, url } = require("./playground/DBConnection.js");

//route import;
const ideaRoute = require("./route/ideaRoute");
const userRoute = require("./route/userRoute");
const commentsRoute = require("./route/commentsRoute");
const pageRoute = require("./route/pageRoute");
const authRoute = require("./route/authRoute");
const categoryRoute = require("./route/categoryRoute");

// error middleware import

const { errorMiddleware } = require("./middleware/errorMiddleware");

//db connection function call;
connectDB();

const app = express();

//express handlebars engine diclear
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    helpers: {
      compareValues,
      trancateContent,
      displayBtn,
      formatDate,
      comparePath,
      // compareValues,
    },
  })
);
app.set("view engine", ".hbs");

//middleware

//for cookies
// app.use(cookieParser());
// console.log(process.env.SECRET_SESSION, "process.env.SECRET_SESSION");
//for session
app.use(
  session({
    // secret: "$2a$10$LPZvQWrXUNp5rgeZY9m3VeTJcirDExWJNNtiVIw7DPu041d3h",
    secret: secretSession,
    resave: false,
    store: MongoStore.create({
      // url: url,
      mongoUrl: url,
      // ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    }),
    saveUninitialized: false,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

//passport middlewre;
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware for showing message
app.use(flash());
app.use(express.json());

//request method
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//public uploads file
app.use(express.static(path.join(__dirname, "uploads")));
// app.use(morgan("dev"));

// const isAuth = function (req, res, next) {
//   // Cookies that have not been signed
//   // console.log("Cookies: ", req.cookies);
//   // if (req.cookies.isLoggedIn === "true") {
//   //   next();
//   //   return;
//   // } else {
//   //   return res.redirect("/auth/login");
//   // }

//   //for session;
//   console.log(req.session.isLoggedIn, "rana");
//   if (req.session.isLoggedIn === "true") {
//     next();
//     return;
//   } else {
//     return res.redirect("/auth/login");
//   }
// };

// app.use((req, res, next) => {
//   console.log(req.session, "season");
//   next();
// });

app.use((req, res, next) => {
  // console.log(req, "req");
  // res.locals.user = req.session.user || null;
  res.locals.user = req?.user || null;
  res.locals.user_id = req?.user?._id || null;
  res.locals.firstName = req?.user?.firstName || null;
  res.locals.isAdmin = req?.user?.role || 0;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  // console.log(req.user, "req");
  next();
});

//route declear ;
app.use("/auth", authRoute);
app.use("/ideas", ideaRoute);
app.use("/users", userRoute);
app.use("/categories", categoryRoute);
app.use("/ideas/:id/comments", commentsRoute);
app.use(pageRoute);

//error middleware handling
app.use(errorMiddleware);

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
