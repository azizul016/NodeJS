const mongoose = require("mongoose");
const { localDB, cloudDB } = require("../config/key");

let url;
// = `mongodb://localhost:27017/ideas-app`;

if (process.env.NODE_ENV !== "production") {
  url = cloudDB;
} else if (process.env.NODE_ENV !== "development") {
  url = localDB;
}

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
