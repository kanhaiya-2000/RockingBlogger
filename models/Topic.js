const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
    name:String,   
    description:String,
    cover:String, 
    followedBy:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    stories:[{
        type:mongoose.Schema.ObjectId,
        ref:"Story"
    }],

})
module.exports = mongoose.model("Topic",TopicSchema);