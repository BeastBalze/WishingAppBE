const User = require('../models/user');
const Wish = require('../models/wish');

exports.create = async (req, res) => {
    try {
        const {day, month, reciverMail, message, name, ocassion} = req.body;
        const user = await User.findById(req.user._id);
        const  w = {
             day: day,
             month: month,
             reciverMail: reciverMail,
             message: message,
             name: name,
             owner: user._id,
             ocassion: ocassion,
        };
        const wish = await Wish.create(w);
        user.wishingList.unshift(wish._id);
        await user.save();
        res.status(201).json({
            success: true,
            message: "Wish Create"
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

exports.del = async (req, res) => {
    try {
        const wish = await Wish.findById(req.params.id);
        if(!wish)
        {
            return res.status(400).json({
                success: false,
                message: "Wish do not exist"
            })
        }
        if(req.user._id.toString() !== wish.owner.toString())
        {
            return res.status(400).json({
                success: false,
                message: "Unautherized"
            })
        }
        await wish.deleteOne();
        const user = await User.findById(req.user._id);
        const i = user.wishingList.indexOf(req.params.id);
        user.wishingList.splice(i, 1);
        await user.save();
        res.status(200).json({
            success: true,
            message:"Deleted successfully"
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

exports.edit = async (req, res) => {
    try {
        const wish = await Wish.findById(req.params.id);
        if(!wish)
        {
            return res.status(400).json({
                success: false,
                message: "Wish do not exist"
            })
        }
        if(req.user._id.toString() !== wish.owner.toString())
        {
            return res.status(400).json({
                success: false,
                message: "Unautherized"
            })
        }
        const {day, month, reciverMail, message, ocassion} = req.body;
        if(day) wish.day = day;
        if(month) wish.month = month;
        if(reciverMail) wish.reciverMail = reciverMail;
        if(message) wish.message = message;
        if(ocassion) wish.ocassion = ocassion;
        await wish.save();
        res.status(200).json({
            success: true,
            message: "Updated Successfully"
        })
    } catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        }) 
    }
}