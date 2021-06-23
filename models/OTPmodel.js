const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    OTP:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    type:{
        type:String
    },
    expires:{
        type:Date,
        required:true
    }
});

module.exports = mongoose.model("OTPmodel",OTPSchema);