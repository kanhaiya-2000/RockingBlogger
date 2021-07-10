const Notification = require("../models/Notification");
const Story = require("../models/Story");
const Comment = require("../models/Comment");
const Report = require("../models/Report");
const User = require("../models/User");
const { generateTemplate } = require("../services/generateTemplate");
const { sendMail } = require("../services/Mailer");
const SavedStory = require("../models/SavedStory");
const LikedStory = require("../models/LikedStory");
const Topic = require("../models/Topic");

exports.getStory = async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.sid).populate({
            path: "user",
            select: "username fullname avatar"
        }).populate({
            path: "topics",
            select: "name"
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
        if (req.user) {
            story.isMine = story.user._id.toString() === req.user.id;
            story.isLiked = story.likedBy.toString().includes(req.user.id);
            const isSaved = await SavedStory.findOne({ story: req.params.sid, userid: req.user.id });
            if (isSaved) {
                story.isSaved = true;
            }
            else {
                story.isSaved = false;
            }
        }
        story.likesCount = story.likedBy.length;
        story.user.isFollowing = req.user && (req.user.following.includes(story.user._id));
        story.likedBy = [];
        story.comments = story.comments.slice(0, 5);
        story.comments.forEach(function (t) {
            t.isMine = req.user && (t.user._id.toString() == req.user.id);
            t.isLiked = req.user && (t.likedBy.toString().includes(req.user.id))
            t.likesCount = (t.likedBy.length);
            t.likedBy = [];
        });
        story.reportCount = 0;
        
        res.status(200).json({ success: true, story});

    }
    catch (e) {
        console.log(e);
        console.log(e);
        return next({
            statusCode: 500,
            message: "Failed to fetch story"
        })
    }

}

exports.getLatestStories = async (req, res, next) => {
    try {
        const { limit } = req.query;
        const topic = await Topic.findOne({ name: req.params.topic }).populate({
            path: "stories",
            select: "title short_des cover user createdAt readingTime likedBy",
            populate: {
                path: "user",
                select: "username cover avatar"
            }
        }).lean().exec();
        stories = topic.stories.reverse().slice(0, limit);
        stories.forEach(async function (s) {
            if(req.user){
                s.isSaved = (await SavedStory.findOne({userid:req.user.id,story:s._id}))?true:false;
            }
            s.likedBy = [];
        })
        setTimeout(function(){
        res.status(200).json({ success: true, stories })
    },100)
    }
    catch (e) {
        return next({
            statusCode: 500,
            message: "Failed to complete request"
        })
    }
}

exports.getPopularStories = async (req, res, next) => {
    try {
        const { limit } = req.query;
        const topic = await Topic.findOne({ name: req.params.topic }).populate({
            path: "stories",
            select: "title short_des cover user createdAt readingTime likedBy",
            populate: {
                path: "user",
                select: "username cover avatar"
            }
        }).lean().exec();
        stories = topic.stories.sort(function (a, b) {
            return a.likedBy.length - b.likedBy.length;
        }).slice(0, limit);
        stories.forEach(async function (s) {
            if(req.user){
                s.isSaved = (await SavedStory.findOne({userid:req.user.id,story:s._id}))?true:false;
            }
            s.likedBy = [];
        })
        setTimeout(function(){
        res.status(200).json({ success: true, stories })
    },100)
    }
    catch (e) {
        return next({
            statusCode: 500,
            message: "Failed to complete request"
        })
    }
}

exports.getTopicDetail = async (req, res, next) => {
    try {
        const topic = await Topic.findOne({ name: req.params.topic }).populate({
            path: "stories",
            select: "topics cover likedBy",
            populate: {
                path: "topics",
                select: "name"
            }
        }).lean().exec();
        if (!topic) {
            return next({
                message: "No such topic",
                statusCode: 404
            })
        }
        topic.relatedTopics = [];
        topic.isFollowing = req.user && topic.followedBy.toString().includes(req.user.id);
        topic.followedBy = [];
        topic.stories.sort(function (a, b) { return a.likedBy.length - b.likedBy.length }).slice(0, 10).forEach(function (s) {
            if (!topic.cover) {
                topic.cover = s.cover;
            }

            topic.relatedTopics = topic.relatedTopics.concat(s.topics);
        });
        topic.stories = [];
        const related = [];
        topic.relatedTopics.forEach(x => { related.push(x.name) });
        console.log(related);
        const relatedOnes = Array.from(new Set(related));
        console.log(relatedOnes);
        topic.relatedTopics = relatedOnes.filter(function (a) { return a != req.params.topic }).slice(0, 5);

        res.status(200).json({ success: true, topic });
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Failed to complete request"
        })
    }
}

exports.trendingStories = async (req, res, next) => {
    try {
        let stories = await Story.find({}).select("user short_des likedBy topics title cover readingTime createdAt").populate({
            path: "user",
            select: "username avatar"
        }).lean().exec();
        const ci = parseInt(req.query.currIndex);


        stories = stories.sort(function (a, b) {
            return b.likedBy.length - a.likedBy.length;
        });
        console.log(ci);
        stories = stories.slice(ci, ci + 5);
        if(req.user){
            stories.forEach(async function(s){                
                s.likedBy = [];                
                const isSaved = await SavedStory.findOne({userid:req.user.id,story:s._id});
                s.isSaved = isSaved?true:false;
            })
        }
        setTimeout(function(){
            res.status(200).json({ success: true, stories })
        },100)
    }
    catch (e) {        
        console.log(e);
        return next({
            statusCode: 500,
            message: e.message
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
            await LikedStory.deleteOne({ userid: req.user.id, story: sid }, (err, res) => {
                if (err) {
                    return next({
                        statusCode: 500,
                        message: "Action failed"
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
            await LikedStory.create({ story: sid, userid: req.user.id });
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
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }


}

exports.addComment = async (req, res, next) => {
    try {
        const { sid } = req.body;
        console.log(req.body);
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
        console.log(e);
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
            if (comment.user._id != req.user.id) {
                const noti = await Notification.create({
                    sender: req.user.username,
                    receiver: [comment.user.username],
                    type: "likecomment",
                    commentId: comment._id,
                    avatar: req.user.avatar,
                    url: `/stories/${comment.story._id}/?commentId=${comment._id}`,
                    Message: `${req.user.username} liked your comment in story | ${comment.story.title}`
                })
                await User.findByIdAndUpdate(comment.user._id, {
                    $push: { unseennotice: noti._id }
                })
            }
            await Comment.findByIdAndUpdate(cid, {
                $push: { likedBy: req.user.id }
            })
        }
        else {
            if (comment.user._id != req.user.id) {
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
            }
            await Comment.findByIdAndUpdate(cid, {
                $pull: { likedBy: req.user.id }
            })
        }
        res.status(200).json({ success: true, cid, unseennotice: req.user.unseennotice.length })
    }
    catch (e) {
        console.log(e);
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
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.reportStory = async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.sid).populate({
            path:"user",
            select:"username"
        }); 
        if (!story) {
            return next({
                statusCode: 404,
                message: "An error occurred"
            })
        }
        console.log(req.body)
        const report = await Report.findOne({ reporter: req.user.id, story: req.params.sid });
        if (report) {
            await report.remove();
            story.reportCount = story.reportCount - 1;
        }
        await Report.create({ reporter: req.user.id, story: req.params.sid, description: req.body.description });
        story.reportCount = story.reportCount + 1;
        await story.save();
        if (story.reportCount%10==0) {
            const template = generateTemplate({ type: "report_story", data: story });
            sendMail(`Report against ${story.title}`, template.text, template.html, [process.env.ADMIN_EMAIL], (err, re) => {
                if (!err) {
                    res.status(200).json({ success: true });
                    return;
                }
                else {
                    return next({
                        message: "Mail could not be sent to admin",
                        statusCode: 500
                    })
                }
            })
        }
        else
            res.status(200).json({ success: true });
    }
    catch (e) {
        console.log(e);
        return next({
            message: "Failed to submit report",
            statusCode: 500
        })
    }
}

exports.searchStory = async (req, res, next) => {
    try {
        console.log(req.body);
        if (!req.body.term) {
            return next({
                message: "Search term is required",
                statusCode: 400
            });
        }
        const currIndex = parseInt(req.query.currIndex);
        const regex = new RegExp(req.body.term, "i");
        Stories = await Story.find({ $or: [{ title: regex }, { short_des: regex }] }).populate({
            path:"user",
            select:"username avatar"
        }).sort("-createdAt").lean().exec();
        Stories = Stories.slice(currIndex, currIndex + 5);
        Stories.forEach(async function (story) {

            story.likesCount = story.likedBy.length;
            if (req.user) {
                story.isLiked = (story.likedBy.toString().includes(req.user.id));
                const isSaved = await SavedStory.findOne({ story: story._id, userid: req.user.id });
                if (isSaved) {
                    story.isSaved = true;
                }
                else {
                    story.isSaved = false;
                }
            }
            story.likedBy = [];
        })
        setTimeout(()=>{
            res.status(200).json({ success: true, stories: Stories })
        },100)

    }
    catch (e) {
        console.log(e);
        return next({
            message: "Action failed",
            statusCode: 500
        })
    }
}

exports.editStory = async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.sid);
        if (!story || story.user != req.user.id) {
            return next({
                message: "You do not have edit access",
                statusCode: 401
            })
        }
        const { short_des, title, html_content, charcount, topics, cover } = req.body.payload;
        //console.log(req.body);
        if (!short_des || !title || !html_content || !topics || topics.length === 0 || !charcount) {
            return next({
                statusCode: 400,
                message: "Please fill all fields"
            })
        }
        if (charcount < 500) {
            return next({
                statusCode: 400,
                message: "Your story is too short"
            })
        }
        
        const toUpdate = {};
        const readingTime = Math.round(charcount / 1000) + " min";
        if (title) toUpdate.title = title;
        if(readingTime) toUpdate.readingTime = readingTime;
        if(cover) toUpdate.cover = cover;
        if (short_des) toUpdate.short_des = short_des;
        if (html_content) toUpdate.html_content = html_content;
        if (topics) toUpdate.topics = topics;
        
        for(const t of story.topics){
            await Topic.findByIdAndUpdate(t,{
                $pull:{stories:story._id}
            });
            
        }
        await Topic.deleteMany({stories:[]},(err,res)=>{
                
        })
        const tt = [];
        for(const t of topics){
            let topic = await Topic.findOne({ name: t.toLowerCase() });
            if (!topic) {
                topic = await Topic.create({ name: t.toLowerCase() })
            }
            tt.push(topic._id);
            topic.stories.push(story._id);
            await topic.save();
        }
        toUpdate.topics = tt;
        await Story.findByIdAndUpdate(req.params.sid, {
            $set: { ...toUpdate }
        },
            {
                new: true,
                runValidators: true
            }
        );
        await Notification.deleteMany({story:story._id,sender:req.user.username},(err,res)=>{
            err&&console.log(err);
        })
        if (req.user.followers.length > 0) {
            const Noti = await Notification.create({
                receiver: req.user.followers,
                sender: req.user.username,
                Message: `${req.user.username} has edited a story | ${title}`,
                url: `/stories/${story._id}`,
                story: story._id,
                avatar: req.user.avatar,
                type: "addstory"
            });


            for (const i of Noti.receiver) {
                await User.findByIdAndUpdate(i, {
                    $push: { unseennotice: Noti._id }
                })
            }
        }
        res.status(200).json({ success: true });
    }
    catch (e) {
        return next({
            message: "Action failed",
            statusCode: 500
        })
    }
}

exports.FetchComments = async (req, res, next) => {
    try {
        const currIndex = parseInt(req.query.currIndex);
        const story = await Story.findById(req.params.sid).populate({
            path: "comments",
            select: "text createdAt likedBy",
            populate: {
                path: "user",
                select: "username avatar"
            }
        }).lean().exec();
        story.comments = story.comments.slice(currIndex, currIndex + 10);
        story.comments.forEach(function (t) {
            t.isMine = req.user && (comment.user._id.toString() == req.user.id);
            t.isLiked = req.user && (comment.likedBy.toString().includes(req.user.id))
            t.likesCount = (t.likedBy.length);
            t.likedBy = [];
        });
        res.status(200).json({ success: true, comments: story.comments });
    }
    catch (e) {
        return next({
            message: "Action failed",
            statusCode: 500
        })
    }
}

