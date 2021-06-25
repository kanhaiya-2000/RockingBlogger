const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    OTP:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
    },
    Timetried:{
        default:0,//give max 5 chance to enter the correct OTP
        type:Number
    }
});

OTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 5*60 });//set expiration after 5 min

module.exports = mongoose.model("OTPmodel",OTPSchema);