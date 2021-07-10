const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    fullname: {
      type: String,
      required: [true, "Your fullname"],
      trim: true,
    },
    tempid:{
      type:String,
      required:true
    },
    username: {
      type: String,
      required: [true, "Your username"],
      trim: true,
      unique: true,
    },    
    isAdmin:{
      type:Boolean,
      default:false
    },
    unseennotice:[{ type: mongoose.Schema.ObjectId,ref:"Notification"}], 
       
    email: {
      type: String,
      required: [true, "Your email"],
      trim: true,      
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],   
      
    },   

    avatar: {
      type: String,
      default:
        "",      
    },
    cover:{
      type:String,
    },
    bio: String,
    website: String,
    preferredTopics:[{type:String}],
    twofactorEnabled:{type:Boolean,default:false},
    followers: [{ type: mongoose.Schema.ObjectId, ref: "User" }],    
    following:[{type: mongoose.Schema.ObjectId, ref: "User" }],    
    stories: [{ type: mongoose.Schema.ObjectId, ref: "Story" }],   
  });

  userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id,tempid:this.tempid }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };
  userSchema.methods.updatePassword = async function (password,tempid){
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);
    this.password = pass;
    this.tempid = tempid;
  }
  userSchema.methods.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  userSchema.pre('remove', function(next) {
    this.model('Comment').deleteMany({ user: this._id }, (err,res)=>{next(err)});
    this.model("OTPmodel").deleteMany({email:this.email},(err,res)=>{next(err)});
    this.model("Story").deleteMany({author:this._id},(err,res)=>{next(err)});
    this.model("Report").deleteMany({reporter:this._id},(err,res)=>{next(err)});
    this.model("Notification").deleteMany({sender:this.username},(err,res)=>{next(err)});
    this.model("ReadingList").deleteMany({userid:this._id},(err,res)=>{next(err)})
    this.model("LikedStory").deleteMany({userid:this._id},(err,res)=>{next(err)});
    this.model("SavedStory").deleteMany({userid:this._id},(err,res)=>{next(err)});    
});
  module.exports = mongoose.model("User", userSchema);