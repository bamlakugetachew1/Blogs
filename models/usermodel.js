const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "please provide a username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
  },
  likedcontent:{
    type:Array,
    default:[]
  },
  savedcontent:{
    type:Array,
    default:[]
  },
});
const User = mongoose.model("User", userSchema);
module.exports = User;
