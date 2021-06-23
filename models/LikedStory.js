const mongoose =  require("mongoose");

const likedStorySchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    story:{
        type:mongoose.Schema.ObjectId,
        ref:"Story" 
    },    
})
module.exports = mongoose.model("LikedStory", likedStorySchema);