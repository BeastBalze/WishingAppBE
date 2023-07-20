const mongoose = require('mongoose');

const wishesSchema = new mongoose.Schema({
    day:{
        type: Number,
        require :[true, "Please Enter a Date"],
    },
    month:{
        type: Number,
        require: [true, "Please enter a Month"]
    },
    reciverMail: {
        type:String,
        require: [true, "Please Enter receiver's Email"],
    },
    message: {
        type: String,
    },
    name: {
        type: String,
        require: [true, "Please Enter the Name"],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    ocassion: {
        type: String,
        require: [true, "Please Enter the ocassion"],
    }
});

module.exports = mongoose.model("Wish", wishesSchema);