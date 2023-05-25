const router = require('express').Router();
const path = require('path');
const postcontrollers = require('../controllers/postcontroller');
const verifyToken = require('../helper/verifytoken')
const multer = require('multer')
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.Cloudnry_Name,
  api_key: process.env.Cloudnry_Api,
  api_secret: process.env.Cloudnry_Secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Blogs",
    public_id: (req, file) =>{return `${file.fieldname}_${Date.now()}` }
  },

});

const upload = multer({ storage: storage })
router.route('/posts/singlepost/:id').get(postcontrollers.getsinglepost);
router.route('/posts/getall/:page').get(postcontrollers.getallpost);
router.route('/posts/lengths').get(postcontrollers.getlength);
router.route('/posts/likecount/:id').get(postcontrollers.getlikecount);
router.route('/posts/comment/:postid').get(postcontrollers.getcommentbyid);
router.use(verifyToken.verifyToken);
router.route('/posts/:authorname').get(postcontrollers.getpostbyauthor);
router.route('/posts/:id').delete(postcontrollers.deleteposts).patch(postcontrollers.updateposts);
router.route('/posts/saved/:savername').get(postcontrollers.getsavedposts);
router.route('/posts/liked/:savername').get(postcontrollers.getlikedposts);
router.route('/posts/create').post(postcontrollers.createpost);
router.route('/posts/like').post(postcontrollers.likepost);
router.route('/posts/save').post(postcontrollers.savepost);
router.route('/posts/comment/create').post(postcontrollers.createComment);
router.post('/posts/uploadimage',upload.single("postimages"),postcontrollers.uploadimages);
module.exports = router;
