const router = require('express').Router();
const usercontrollers = require('../controllers/usercontroller');
router.route('/users/register').post(usercontrollers.createusers);
router.route('/users/login').post(usercontrollers.loginuser);
router.route('/users/logout').get(usercontrollers.logoutuser);
router.route('/users/saved/:id').get(usercontrollers.saveditem);
module.exports = router;

