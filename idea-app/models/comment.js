// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  title: {
    type: String,
    require: true,
    maxLength: [100, "Title is not greater then 100 words"],
  },
  text: {
    type: String,
    maxLength: [1000, "Text is not greater then 1000"],
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment, commentSchema };
