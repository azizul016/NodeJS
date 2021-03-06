//home controller
const homeController = (req, res) => {
  return res.render("pages/index", {
    text: "Hello from Node Js",
    title: "Home Page",
  });
};

//about controller
const aboutController = (req, res) => {
  return res.render("pages/about", {
    text: "Know as About Us",
    title: "About US",
  });
};

//not found controller
const notFoundController = (req, res) => {
  return res.render("pages/notFound");
};

module.exports = { homeController, aboutController, notFoundController };
