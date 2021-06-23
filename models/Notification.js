const mongoose =  require("mongoose");

const NoticeSchema = new mongoose.Schema({
    receiver:{
        type:[String],        
        required:true,       
    },
    url:{
        type:String
    },
    story:{
        type:mongoose.Schema.ObjectId,
        
    },
    commentId:{
        type:mongoose.Schema.ObjectId
    },
    sender:{
        type: String,
        required: true
    },
    avatar:{
        type:String        
    },
    Message:{
        type:String,
        required: true,
        trim: true,
    },
    type:{
        type:String
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Notification", NoticeSchema);