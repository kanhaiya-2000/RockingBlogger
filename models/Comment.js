const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:true,
    },
    story:{
        type:mongoose.Schema.ObjectId,
        ref:"Story"
    },
    likedBy:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Comment", CommentSchema);
