// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { commentSchema } = require("./comment");

const ideaSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is Required"],
      minLength: [2, "Title Must Be 2 Character"],
      maxLength: [50, "Title Must Be 50 Character"],
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

    //or

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

    //sample system
    // comments: [
    //   {
    //     title: {
    //       type: String,
    //       require: true,
    //       maxLength: [100, "Title is not greater then 100 words"],
    //     },
    //     text: {
    //       type: String,
    //       maxLength: [1000, "Text is not greater then 1000"],
    //     },
    //   },
    // ],

    //subdocument or embedding system
    // comments: {
    //   type: commentSchema,
    //   required: true,
    // },
    //or
    // comments: [commentSchema],

    //donot need using objectin using vertiuals
    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment",
    //   },
    // ],

    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      firstName: String,
    },
    categories: [
      {
        categoryName: String,
      },
    ],
    likes: [
      {
        type: mongoose.Types.ObjectId,
      },
    ],
    image: String,
  },
  {
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

ideaSchema.virtual("comments", {
  ref: "Comment", // The model to use
  localField: "_id", // Find people where `localField`
  foreignField: "idea", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
});

const Idea = mongoose.model("Idea", ideaSchema);
module.exports = Idea;
