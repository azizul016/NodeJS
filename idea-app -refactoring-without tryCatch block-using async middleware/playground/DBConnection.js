const mongoose = require("mongoose");

module.exports = async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ideas-app");
    console.log("Datebase Is Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};
