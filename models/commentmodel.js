const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "A comment is required"],
  },
  commenterid: {
    type: String,
    required: [true],
  },
  postid:{
    type:String,
    required: [true],
  }
},  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
