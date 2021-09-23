// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  //chield to paraents reference;
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Idea",
  },
  title: {
    type: String,
    require: true,
    maxLength: [100, "Title is not greater then 100 words"],
  },
  text: {
    type: String,
    maxLength: [1000, "Text is not greater then 1000"],
  },
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: String,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = { Comment, commentSchema };
