const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StorySchema = new Schema({
    short_des:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    url:{
        type:String,    
        required:true,    
    }, 
    html_content:{
        type:String,
        required:true
    },    
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }, 

    keywords:{
        type:[String]
    },

    likedBy:[{
        type: mongoose.Schema.ObjectId,   
    }],
    
    comments:[{
        type: mongoose.Schema.ObjectId,
        ref:"Comment"
      }],

    reportCount:{
          type:Number,
          default:0
      },
    createdAt:{
        type:Date,
        default: Date.now
    }
});
StorySchema.pre('remove', function(next) {
    this.model('Comment').deleteMany({ story: this._id }, (err,res)=>{next(err)});
    this.model("Report").deleteMany({story:this._id},(err,res)=>{next(err)});
    this.model("Notification").deleteMany({story:this._id},(err,res)=>{next(err)});
    this.model("LikedStory").deleteMany({story:this._id},(err,res)=>{next(err)});
    this.model("ReadingList").deleteMany({story:this._id},(err,res)=>{next(err)});
    this.model("SavedStory").deleteMany({story:this._id},(err,res)=>{next(err)});
});
module.exports = mongoose.model("Story", StorySchema);