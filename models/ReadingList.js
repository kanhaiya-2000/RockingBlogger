const mongoose =  require("mongoose");

const readStorySchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    story:{
        type:mongoose.Schema.ObjectId,
        ref:"Story" 
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("ReadingList", readStorySchema);