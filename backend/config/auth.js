const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.isAuth = async (req, res, next) => {
    try {
        const token = req.body.token;
        if(!token) {
            return res.status(401).json({
                message: "Please Login First",
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode._id);
        next();
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};