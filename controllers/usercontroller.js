const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.createusers = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });
    await user.save();
    res.status(200).json({
      message: "succesfully registerd please Login",
    });
  } catch (err) {
    res.json({
      message: "user name  alerady exist",
    });
  }
};

exports.loginuser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user != null) {
      const validate = await bcrypt.compare(req.body.password, user.password);
      if (validate) {
        const accessToken = jwt.sign(  { user: user },  process.env.SecretToken, { expiresIn: "1d",});
         res.json({
          message: "success",
          userid: user._id,
          username:user.username,
          accessToken:accessToken
        });
      } else {
        res.json({
          message: "Incorrect Password",
        });
      }
    } else {
      res.json({
        message: "no user found with this name",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.logoutuser = (req, res) => {
  res.cookie("token", " ").json({ message: "Logged Out" });
};

exports.saveditem = async (req, res) => {
  try{
    const user = await User.findById(req.params.id);
    res.json({
      user: user.savedcontent,
    });
  }
  catch(err){
    console.log(err);
  }
};
