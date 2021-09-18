const mongoose = require("mongoose");

const url = `mongodb://localhost:27017/ideas-app`;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Datebase Is Connected Successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  url,
  connectDB,
};
