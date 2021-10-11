const { Category } = require("../models/category");
const Idea = require("../models/idea");

const addCategoryController = async (req, res) => {
  //   console.log("This is category page");
  return res.render("admin/category", {
    title: "Add Category",
    path: "/category",
  });
};

//post category controller;
const postCategoryController = async (req, res) => {
  const category = new Category(req?.body);

  await category.save();
  // console.log("something happend");
  res
    .status(200)
    .send({ success: true, message: "Category Successfully Saved" });
};

//get all category

const getCategoryController = async (req, res, next) => {
  const categories = await Category.find();
  // console.log(categories, "Category");
  return res.status(200).send({ success: true, categories: categories });
};

//delete category;
const deleteCategoryController = async (req, res) => {
  const category = await Category.findOneAndDelete({
    category: req?.params?.categoryName,
  });
  if (category) {
    return res
      .status(200)
      .send({ success: true, message: "Çategory Delete Successfully" });
  }
  return res
    .status(400)
    .send({ success: false, message: "Category Cannot Found" });
};

//get all ideas that creating by samilar category;
const getCategoryNameByIdeaController = async (req, res) => {
  const page = +req?.query?.page || 1;
  const per_page_item = 1;

  // console.log(req.params.categoryName, "category name");
  const category = req.params.categoryName;

  //get all ideas;
  const ideas = await Idea.find().lean().sort({ createdAt: -1 });

  //get all categoryes
  const categories = await Category.find().lean();

  //finding category;
  const findingCategory = categories.find(
    (eachCategory) => eachCategory.category === category
  );

  //matched idea by perticular category;
  //virtual field locally
  let matchedIdea = [];
  // console.log(ideas, "ideas")
  ideas.map((eachIdea) => {
    eachIdea?.categories?.map((category) => {
      if (category?.categoryName === findingCategory?.category)
        return matchedIdea.push(eachIdea);
    });
  });
  // console.log(ideas, "ideas");

  //vertural field
  // const allIdeasByCategory = await Category.findOne({ category })
  //   .populate("ideas")
  //   .lean();
  // console.log(allIdeasByCategory, "something happend");

  // const filterIdeasByStatus = allIdeasByCategory?.ideas?.filter(
  //   (status) => status.status === "public"
  // );
  const filterIdeasByStatus = matchedIdea?.filter(
    (status) => status.status === "public"
  );
  // console.log(filterIdeasByStatus, "status");
  //pagination start
  const categoryPublicIdeaCount = filterIdeasByStatus.length;
  const categoryPublicIdeaToPass = filterIdeasByStatus.splice(
    (page - 1) * per_page_item,
    per_page_item
  );

  // console.log(categoryPublicIdeaToPass, "category");
  //pagination end

  // console.log(filterIdeasByStatus, "filterIdeasByStatus");
  if (filterIdeasByStatus?.length > 0) {
    return res.render("ideas/index", {
      title: `All Ideas Under ${findingCategory?.category}`,
      categoryName: findingCategory?.category,
      ideas: categoryPublicIdeaToPass,
      ideaTags: ideas,
      categories: categories,
      currentPage: page,
      previousPage: page - 1,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      hasNextPage: page * per_page_item < categoryPublicIdeaCount,
      lastPage: Math.ceil(categoryPublicIdeaCount / per_page_item),
    });
    // console.log(allIdeasByCategory, "allIdeasByCategory");
    // return;
  } else {
    return res.status(200).render("ideas/noDataFound", {
      title: "Data Not Found",
    });
    // return res.status(404).render("pages/notFound", {
    //   title: "Not Found",
    // });
  }
};

module.exports = {
  addCategoryController,
  postCategoryController,
  getCategoryController,
  deleteCategoryController,
  getCategoryNameByIdeaController,
};
