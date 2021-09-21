// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ideaSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is Required"],
    minLength: [2, "Title Must Be 2 Character"],
    maxLength: [20, "Title Must Be 20 Character"],
    trim: true,
    // toLowerCase: true,
    // set(v) {
    //   return v.toLowerCase();
    // },
    // get(v) {
    //   return v.toUpperCase();
    // },
  },
  description: {
    type: String,
    // required: [true, "Description is Required"],
    maxLength: [10000, "Description is not greater then 10000 words"],
  },
  allowComments: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["public", "private"],
    message: "{VALUE} is not supported",
    // required: true,
    default: "public",
  },
  //donot needed custom validator
  tags: [
    { type: String, required: [true, "Idea Must Have One Tags"], trim: true },
  ],
  // tags: {
  //   type: [String],
  //   required: true,
  //   trim: true,
  //   validator: {
  //     validator: (v) => {
  //       return v[0].length > 0;
  //     },
  //     message: "Idea Must Have One Tags",
  //   },
  // },
});

const Idea = mongoose.model("Idea", ideaSchema);
module.exports = Idea;
