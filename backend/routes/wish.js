const express = require('express');
const { isAuth } = require('../config/auth');
const { create, del, edit } = require('../controllers/wish');
const router = express.Router();

router.route("/create").post(isAuth, create);
router.route("/delete/:id").put(isAuth, del);
router.route("/edit/:id").put(isAuth, edit);

module.exports = router;