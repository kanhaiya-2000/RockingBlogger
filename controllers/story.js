const Notification = require("../models/Notification");
const Story = require("../models/Story");
const Comment = require("../models/Comment");
const Report = require("../models/Report");
const { generateTemplate } = require("../services/generateTemplate");
const { sendMail } = require("../utils/mailer");
const SavedStory = require("../models/SavedStory");
const LikedStory = require("../models/LikedStory");

exports.getStory = async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.sid).populate({
            path: "user",
            select: "username fullname avatar"
        }).populate({
            path: "comments",
            select: "text createdAt likedBy",
            populate: {
                path: "user",
                select: "username avatar"
            }
        }).lean().exec();

        if (!story) {
            return next({
                statusCode: 404,
                message: "Story not found"
            })
        }
        story.isMine = story.user._id.toString() === req.user.id;
        story.likesCount = story.likedBy.length;
        story.isLiked = story.likedBy.toString().includes(req.user.id);
        story.likedBy = [];
        story.comments.forEach(function (t) {
            t.isMine = (comment.user._id.toString() == req.user.id);
            t.likesCount = (t.likedBy.length);
            t.likedBy = [];
        });
        story.reportCount = 0;
        res.status(200).json({ success: true, story, unseennotice: req.user.unseennotice.length });

    }
    catch (e) {
        return next({
            statusCode: 500,
            message: "Failed to fetch story"
        })
    }

}

exports.trendingStories = async (req, res, next) => {
    try {
        let stories = await Story.find({});
        stories = stories.sort(function (a, b) {
            return a.likedBy.length - b.likedBy.length;
        });
        res.status(200).json({ success: true, stories, unseennotice: req.user.unseennotice.length })
    }
    catch (e) {
        return next({
            statusCode: 500,
            message: "Failed to fetch stories"
        })
    }
}

exports.toggleLike = async (req, res, next) => {
    try {
        const { sid } = req.body;
        const story = await Story.findById(sid).populate({
            path: "user",
            select: "username"
        });
        if (!story) {
            return next({
                statusCode: 404,
                message: "No story found"
            })
        }
        if (story.likedBy.toString().includes(req.user.id)) {
            await LikedStory.deleteOne({userid:req.user.id,story:sid},(err,res)=>{
                if(err){
                    return next({
                        statusCode:500,
                        message:"Action failed"
                    })
                }
            })
            const Noti = await Notification.findOne({ receiver: [story.user.username], sender: req.user.username, type: "likeStory", story: story._id });
            if (Noti) {
                await User.findByIdAndUpdate(story.user._id, {
                    $pull: { unseennotice: Noti._id }
                })
            }
            await Story.findByIdAndUpdate(sid, {
                $pull: { likedBy: req.user.id }
            })
        }
        else {
            await LikedStory.create({story:sid,userid:req.user.id});
            if (story.user.username != req.user.username) {
                const Noti = await Notification.create({ receiver: [story.user.username], sender: req.user.username, type: "likeStory", story: story._id, Message: `${req.user.username} liked your story | ${story.title}`, avatar: req.user.avatar, url: `/${req.user.username}` });
                await User.findByIdAndUpdate(story.user._id, {
                    $push: { unseennotice: Noti._id }
                });
            }
            await Story.findByIdAndUpdate(sid, {
                $push: { likedBy: req.user.id }
            })
        }
        res.status(200).json({ success: true, unseennotice: req.user.unseennotice.length });
    }
    catch (e) {
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }


}

exports.addComment = async (req, res, next) => {
    try {
        const { sid } = req.body;
        const story = await Story.findById(sid).populate({
            path: "user",
            select: "username"
        });
        if (!story) {
            return next({
                message: "Story not found",
                statusCode: 404
            })
        }

        let comment = await Comment.create({
            user: req.user.id,
            story: sid,
            text: req.body.text,
        });

        await Notification.deleteMany({ sender: req.user.username, receiver: [story.user.username], type: "addcomment" });

        story.comments.push(comment._id);
        await story.save();

        if (req.user.id != story.user._id) {
            const noti = await Notification.create({ receiver: [story.user._id], avatar: `${req.user.avatar}`, url: `/stories/${story._id}/?commentId=${comment._id}`, commentId: comment._id, sender: req.user.id, story: story._id, Message: `${req.user.username} commented on your story` });
            await User.findOneAndUpdate({ username: story.user.username }, {
                $push: { unseennotice: noti._id }
            });
        }

        res.status(200).json({ success: true, unseennotice: req.user.unseennotice.length })



    }
    catch (e) {
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.toggleLikeComment = async (req, res, next) => {
    try {
        const { cid } = req.body;
        const comment = await Comment.findById(cid).populate({
            path: "user",
            select: "username"
        }).populate({
            path: "story",
            select: "title"
        });
        if (!comment) {
            return next({
                statusCode: 404,
                message: "Failed to process request"
            })
        }
        const liked = (comment.likedBy.toString().includes(req.user.id));
        if (!liked) {
            const noti = await Notification.create({
                sender: req.user.username,
                receiver: [comment.user.username],
                type: "likecomment",
                commentId: comment._id,
                avatar: req.user.avatar,
                url: `/stories/${comment.story._id}/?commentId=${comment._id}`,
                Message: `${req.user.username} liked your comment in story | ${story.title}`
            })
            await User.findByIdAndUpdate(comment.user._id, {
                $push: { unseennotice: noti._id }
            })
            await Comment.findByIdAndUpdate(cid, {
                $push: { likedBy: req.user.id }
            })
        }
        else {
            const noti = await Notification.findOne({
                sender: req.user.username,
                receiver: [comment.user.username],
                type: "likecomment",
                commentId: comment._id,
            })
            if (noti) {
                await User.findByIdAndUpdate(comment.user._id, {
                    $pull: { unseennotice: noti._id }
                })
            }
            await Comment.findByIdAndUpdate(cid, {
                $pull: { likedBy: req.user.id }
            })
        }
        res.status(200).json({ success: true, cid, unseennotice: req.user.unseennotice.length })
    }
    catch (e) {
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        const cid = req.params.cid;
        const comment = await Comment.findById(cid);
        if (!comment) {
            return next({
                statusCode: 404,
                message: "comment not found"
            })
        }
        if (comment.user != req.user.id && !req.user.isAdmin) {
            return next({
                statusCode: 401,
                message: "you cannot delete this comment"
            })
        }
        await Story.findByIdAndUpdate(comment.story, {
            $pull: { comments: comment._id }
        });
        await Notification.deleteMany({ commentId: comment._id }, (err, res) => { });
        res.status(200).json({ success: true, unseennotice: req.user.unseennotice.length });
    }
    catch (e) {
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.reportStory = async (req, res, next) => {
    try{
        const story = await Story.findById(req.params.sid);
        if(!story){
            return next({
                statusCode:404,
                message:"An error occurred"
            })
        }
        const report = await Report.findOne({reporter:req.user.id,story:sid});
        if(report){
            await report.remove();
            story.reportCount=story.reportCount - 1;
        }
        await Report.create({reporter:req.user.id,story:sid,description:req.body.description});
        story.reportCount = story.reportCount + 1;
        await story.save();
        if(story.reportCount%10==0){
            const template = generateTemplate({type:"report_story",data:story});
            sendMail(`Report against ${story.title}`,template.text,template.html,[process.env.ADMIN_EMAIL],(err,res)=>{
                if(!err){
                    res.status(200).json({success:true});
                    return;
                }
                else{
                    return next({
                        message:"Mail could not be sent to admin",
                        statusCode:500
                    })
                }
            })
        }
        res.status(200).json({success:true});
    }
    catch(e){
        return next({
            message:"Failed to submit report",
            statusCode:500
        })
    }
}

exports.searchStory = async (req, res, next) => {
    try{
        if(!req.query.term){
            return;
        }
        const regex = new RegExp(req.body.term, "i");
        Stories = await Story.find({ $or: [{ title: regex }, { keywords: { $in: [regex] } }, { short_des: regex }] }).sort("-createdAt").lean().exec();
        Stories.forEach(async function(story){
            story.isLiked = (story.likedBy.toString().includes(req.user.id));
            story.likesCount = story.likedBy.length;
            const isSaved = await SavedStory.findOne({story:sid,userid:req.user.id});
            if(isSaved){
                story.isSaved = true;
            } 
            else{
                story.isSaved = false;
            }
        })
        res.status(200).json({success:true,stories:Stories})

    }
    catch(e){
        return next({
            message:"Action failed",
            statusCode:500
        })
    }
}

exports.editStory = async (req, res, next) => {
    try{
        const story = await Story.findById(req.params.sid);
        if(!story||story.user!=req.user.id){
            return next({
                message:"You do not have edit access",
                statusCode:401
            })
        }
        const {title,short_des,html_content,keywords} = req.body;
        const toUpdate = {};
        if(title) toUpdate.title = title;
        if(short_des) toUpdate.short_des = short_des;
        if(html_content) toUpdate.html_content = html_content;
        if(keywords) toUpdate.keywords = keywords;
        
        await Story.findByIdAndUpdate(req.params.sid,{
                $set:{...toUpdate}
            },
            {
                new:true,
                runValidators:true
            }
        );
        res.status(200).json({success:true});
    }
    catch(e){
        return next({
            message:"Action failed",
            statusCode:500
        })
    }
}

