const express = require('express');
const { login, register, logout, updatePassword, updateProfile, getAllWish, forgotPassword, resetPassword } = require('../controllers/user');
const { isAuth } = require('../config/auth');
const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(logout);
router.route("/update/password").put(isAuth, updatePassword);
router.route("/update/profile").put(isAuth, updateProfile);
router.route("/getall").put(isAuth, getAllWish);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
module.exports = router;