const mongoose =  require("mongoose");

const savedStorySchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    story:{
        type:mongoose.Schema.ObjectId,
        ref:"Story" 
    }
})
module.exports = mongoose.model("SavedStory", savedStorySchema);