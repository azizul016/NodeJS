// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      maxLength: 15,
      unique: true,
    },
  },
  {
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//mapping vertiual field for getting all ideas that chreating same category

categorySchema.virtual("ideas", {
  ref: "Idea", // The model to use
  localField: "category", // Find people where `localField`
  foreignField: "categories.categoryName", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
});

const Category = mongoose.model("Category", categorySchema);
module.exports = { Category, categorySchema };
