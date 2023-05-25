const Post = require("../models/postmodel");
const User = require("../models/usermodel");
const Comment = require('../models/commentmodel');

exports.uploadimages = (req, res) => {
  res.json({
    message: "success",
    imageurl: req.file.filename,
  });
};

exports.getallpost = async (req, res) => {
  try {
    let limit = 3;
    let page = req.params.page || 1;
    let skip = (page-1)*limit;
    let posts = await Post.find().limit(limit).skip(skip)
      .select({ content: 0, clamperid: 0 })
      .sort({ createdAt: -1 });
    res.json({
      data: posts,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getlength = async (req, res) => {
  try {
    let post = await Post.find();
    res.json({
      postlength: post.length,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getsinglepost = async (req, res) => {
  try {
    const { id } = req.params;
    let post = await Post.findById(id);
    res.json({
      data: post,
    });
  } catch (err) {
    console.log(err);
  }
};


exports.getpostbyauthor = async (req, res) => {
  try {
    const { authorname } = req.params;
    let post = await Post.find({author:authorname});
    res.json({
      data: post,
      length:post.length
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteposts = async (req, res) => {
  try {
    const { id } = req.params;
    const array = id.split(" ");
    await Post.findByIdAndRemove(array[0]);
    await User.findByIdAndUpdate(array[1], {
      $pull: { likedcontent: array[0]},
    });
    await User.findByIdAndUpdate(array[1], {
      $pull: { savedcontent: array[0] },
    });
    await Comment.deleteMany({postid:array[0]})
    res.json({
      data: "deleted",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getsavedposts = async (req, res) => {
  try {
    let savedposts = [];
    const { savername } = req.params;
    let post = await User.findOne({username:savername});
    for(let i=0; i<post.savedcontent.length; i++){
     let items = await Post.findById(post.savedcontent[i]);
     savedposts.push(items);
    }
    res.json({
      data: savedposts,
      length:savedposts.length
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getlikedposts = async (req, res) => {
  try {
    let savedposts = [];
    const { savername } = req.params;
    let post = await User.findOne({username:savername});
    for(let i=0; i<post.likedcontent.length; i++){
     let items = await Post.findById(post.likedcontent[i]);
     savedposts.push(items);
    }
    res.json({
      data: savedposts,
      length:savedposts.length
    });
  } catch (err) {
    console.log(err);
  }
};


exports.createpost = async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      summery: req.body.summery,
      content: req.body.content,
      author: req.user.user.username,
      imageurl: req.body.imageurl,
    });
    await post.save();
    res.status(200).json({
      message: "success",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateposts = async (req, res) => {
  try {
    const {id} = req.params;
    const post = {
      title: req.body.title,
      summery: req.body.summery,
      content: req.body.content,
    };
    await Post.findByIdAndUpdate(id, { $set: post });
    res.status(200).json({
      message: "post updated succesfully",
    });
  } catch (err) {
    res.status(400).json({
      message: err,
    });
  }
};


exports.likepost = async (req, res) => {
  try {
    const postid = req.body.postid;
    const commenterid = req.body.commenterid;
    var commenter = await User.findById(commenterid);
    if (commenter.likedcontent.includes(postid)) {
      await Post.findByIdAndUpdate(postid, {
        $pull: { clamperid: commenterid },
      });
      await User.findByIdAndUpdate(commenterid, {
        $pull: { likedcontent: postid },
      });
    } else {
      await Post.findByIdAndUpdate(postid, {
        $push: { clamperid: commenterid },
      });
      await User.findByIdAndUpdate(commenterid, {
        $push: { likedcontent: postid },
      });
    }
    res.json({
      message: "success",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.savepost = async (req, res) => {
  try {
    const postid = req.body.postid;
    const commenterid = req.body.commenterid;
    var commenter = await User.findById(commenterid);
    if (commenter.savedcontent.includes(postid)) {
      await User.findByIdAndUpdate(commenterid, {
        $pull: { savedcontent: postid },
      });
    } else {
      await User.findByIdAndUpdate(commenterid, {
        $push: { savedcontent: postid },
      });
    }
    res.json({
      message: "success",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getlikecount = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json({
      length: post.clamperid.length,
      clamper: post.clamperid,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createComment = async(req,res)=>{
  try {
      const comment = new Comment({
        comment: req.body.comment,
        commenterid: req.body.commenterid,
        postid: req.body.postid,
      });
      await comment.save();
      res.status(200).json({
        message: "comment saved",
      });
    } catch (err) {
      console.log(err);
    }
}


exports.getcommentbyid = async(req,res)=>{
  try {
      const { postid } = req.params;
      let post = await Comment.find({postid : postid}).sort({ createdAt: -1 });
      res.json({
        data: post,
        length:post.length
      });
    } catch (err) {
      console.log(err);
    }
}
