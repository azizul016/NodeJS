const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
    minLength: 2,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
    minLength: 2,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return v.match(/\S+@\S+\.\S+/);
      },
      message: "Please Give a valid email address",
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
    minLength: 2,
    validate: {
      validator: (v) => {
        let passingArray = ["password", "123456", "god123"];
        let isMatch = passingArray.some((pass) => v.includes(pass));
        if (isMatch) return false;
      },
      message: function (props) {
        return `${props.value} is a common password'`;
      },
    },
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
