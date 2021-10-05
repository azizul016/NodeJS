const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
//idea schema;
const Idea = require("./idea");

const userSchema = new Schema({
  googleId: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 20,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 20,
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
  role: {
    type: Number,
    default: 0,
  },
});

//before save hashed password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  }
  next();
});

//deelte account
// all ideas delete after deleting account for perticular user
userSchema.pre("remove", async function (next) {
  // console.log(this, "this");
  const user = this;
  const id = user?._id;
  await Idea.deleteMany({ "user.id": id });
  console.log("Delete successfully");
  next();
});

//get idea array by perticular user;

userSchema.virtual("ideas", {
  ref: "Idea", // The model to use
  localField: "_id", // Find people where `localField`
  foreignField: "user.id", // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
