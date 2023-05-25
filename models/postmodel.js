const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    summery: {
      type: String,
    },
    content: {
      type: String,
    },
    author: {
      type: String,
    },
    imageurl: {
      type: String,
    },
    clamperid:{
      type:Array,
      default:[],
    }
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
