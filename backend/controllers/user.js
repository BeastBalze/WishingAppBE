const { sendEmail } = require('../config/sendmail');
const User = require('../models/user');
const Wish = require('../models/wish');
const crypto = require('crypto');

exports.login = async (req, res) => {
    try {
        
        const {email, password} = req.body;
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User Not Found"
            });
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Password Not Match"
            })
        }
        const token = await user.generateToken();
        res.status(200).json({
            success: true,
            user,
            token,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.register = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        let user = await User.findOne({ email });
        if(user)
        {
            return res
            .status(400)
            .json({success: false, message: "User Already Exist"});
        };
        user = await User.create({name, email, password});
        res.status(201).json({success: true, user });
    } catch (e){
        res.status(500).json({
            success : false,
            message : e.message,
        });
    }
}

exports.logout = async (req, res) => {
    try {
        res.status(200)
        .json({
            success: true,
            message: "Logged Out"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        let user = await User.findById(req.user._id).select("+password");
        const isMatch = await user.matchPassword(oldPassword);
        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "InValid old Password"
            })
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password Updated"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const {name, email } = req.body;
        var user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                success:false,
                message: "Email Already Exist"
            });
        }
        user = await User.findById(req.user._id);
        if(name) {
            user.name = name;
        }
        if(email) {
            user.email = email;
        }
        await user.save();
        res.status(200).json({
            success: true,
            message: "Profile Update"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

exports.getAllWish = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishingList");
        const list = user.wishingList;
        const name = user.name;
        res.status(200).json({
            success: true,
            list,
            name
        })
    } catch (e) {
        res.status(500).json({
            success:false,
            message: e.message
        })
    }
}


exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        
        if(!user) {
            res.status(404).json({
                success:false,
                message: "User not Found"
            })
        };
        const token = user.getResetPasswordToken();
        await user.save();
        const resetUrl = `https://yourwishingapp.onrender.com/#/password/reset/${token}`;
        const msg = `Click the link below to reset your password\nThis link is valid for 10 minutes\n\n${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Reset password",
                message: msg,
            });
            res.status(200).json({
                success: true,
                message: `Mail sent to ${user.email}`
            })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    } catch (e) {
        res.status(500).json({
            success:false,
            message: e.message
        })
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");
        const user = await User.findOne({resetPasswordToken : resetToken, resetPasswordExpire : {$gt: Date.now()}})
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Token is Invalid"
            })
        }
        user.password = req.body.password;
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password Updated Sccessfully"
        })

    } catch (e) {
        res.status(500).json({
            success:false,
            message: e.message
        })
    }
}
