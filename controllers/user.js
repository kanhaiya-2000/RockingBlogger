const Notification = require("../models/Notification");
const OTPmodel = require("../models/OTPmodel");
const ReadingList = require("../models/ReadingList");
const SavedStory = require("../models/SavedStory");
const LikedStory = require("../models/LikedStory");
const Story = require("../models/Story");
const Topic = require("../models/Topic");
const User = require("../models/User");
const { generateOTP } = require("../services/generateOTP");
const { generateTemplate } = require("../services/generateTemplate");

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.params.uid }).select("cover avatar fullname username bio website").lean().exec();

        if (!user) {
            return next({
                statusCode: 404,
                message: "User not found"
            })
        }
        if (req.user) {
            user.isMe = (req.params.uid == req.user.username);
            user.isFollowing = req.user.following.includes(user._id);
        }
        res.status(200).json({ success: true, profile: user })
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }

}

exports.getUserData = async (req, res, next) => {
    try {
        // request_uri http://localhost:55000/user/getdata/:uid/?currIndex=n&data=followers

        const { data } = req.query;
        const currIndex = parseInt(req.query.currIndex);
        let user,stories;
        switch (data) {
            case "followers":
            case "following":
                    user = await User.findOne({ username: req.params.uid }).select(data).populate({
                    path: data,
                    select: "username avatar"
                }).lean().exec();

                if (!user) {
                    return next({
                        statusCode: 404,
                        message: "User not found"
                    })
                }
                data2 = user[data].reverse().slice(currIndex, currIndex + 10);//select max 10 users at a time
                if (req.user) {
                    data2.forEach(function (t) {
                        t.isFollowing = req.user.following.includes(t._id)
                    })
                }
                res.status(200).json({ success: true, users: data2 });
                break;
            case "savedstory":
                if (!req.user) {
                    return next({
                        statusCode: 400,
                        message: "Please login first"
                    })
                }
                data2 = await SavedStory.find({ userid: req.user.id }).populate({
                    path: "story",
                    select: "short_des readingTime title likedBy createdAt cover user",
                    populate:{
                        path:"user",
                        select:"username avatar"
                    }
                }).lean().exec();
                stories = [];
                data2.reverse();
                data2 = data2.slice(currIndex, currIndex + 5);
                data2.forEach(function (t) {
                    t.story.isSaved = true;
                    t.storyisLiked = t.story.likedBy.toString().includes(req.user.id);
                    t.story.likesCount = t.story.likedBy.length;
                    t.story.likedBy = [];
                    stories.push(t.story);
                })
                setTimeout(()=>
                    res.status(200).json({ success: true, stories, unseennotice: req.user.unseennotice.length }),
                100)
                break;
            case "likedstory":
                if (!req.user) {
                    return next({
                        statusCode: 400,
                        message: "Please login first"
                    })
                }
                data2 = await LikedStory.find({ userid: req.user.id }).populate({
                    path: "story",
                    select: "short_des readingTime title likedBy createdAt cover user",
                    populate:{
                        path:"user",
                        select:"username avatar"
                    }
                }).lean().exec();
                data2.reverse();
                data2 = data2.slice(currIndex, currIndex + 5);
                stories = [];
                data2.forEach(async function (t) {
                    const isSaved = await SavedStory.findOne({ story: t.story._id, userid: req.user.id });
                    t.story.isSaved = isSaved?true:false;
                    t.story.isLiked = t.story.likedBy.toString().includes(req.user.id);
                    t.story.likesCount = t.story.likedBy.length;
                    t.story.likedBy = [];
                    stories.push(t.story);
                })
                setTimeout(()=>
                    res.status(200).json({ success: true, stories, unseennotice: req.user.unseennotice.length }),
                100)
                break;
            case "mystory":
                //console.log(req.params.uid);
                user  = await User.findOne({username:req.params.uid});
                stories = await Story.find({user:user._id}).select("short_des title readingTime likedBy createdAt user cover").populate({
                    path:"user",
                    select:"username avatar"
                }).lean().exec();
                //console.log(user);
                stories.reverse();
                stories.slice(currIndex, currIndex + 5).forEach(async function (s) {
                    if(req.user){
                        const isSaved = await SavedStory.findOne({ story: s._id, userid: req.user.id });
                        const isLiked = (s.likedBy.toString().indexOf(req.user.id) > -1);
                        s.isLiked = isLiked;
                        s.likesCount = s.likedBy.length;
                        s.likedBy = [];
                        s.isSaved = isSaved ? true : false;
                    }
                });
                setTimeout(()=>
                    res.status(200).json({ success: true, stories:stories.slice(currIndex, currIndex + 5) }),
                100)
                break;
            case "readinglist":
                if (!req.user) {
                    return next({
                        statusCode: 400,
                        message: "Please login first"
                    })
                }
                data2 = await ReadingList.find({ userid: req.user.id }).populate({
                    path: "story",
                    select: "short_des readingTime title likedBy createdAt cover user",
                    populate:{
                        path:"user",
                        select:"username avatar"
                    }
                }).lean().exec();
                data2.reverse();
                data2 = data2.slice(currIndex, currIndex + 5);
                stories = [];
                data2.forEach(async function (t) {
                    const isSaved = await SavedStory.findOne({ story: t.story._id, userid: req.user.id });
                    t.story.isSaved = isSaved ? true : false;
                    t.story.isLiked = t.story.likedBy.toString().includes(req.user.id);
                    t.story.likesCount = t.story.likedBy.length;
                    t.story.likedBy = [];
                    stories.push(t.story);
                })
                setTimeout(()=>
                    res.status(200).json({ success: true, stories, unseennotice: req.user.unseennotice.length }),
                100)
                break;
            default:
                return next({
                    statusCode: 400,
                    message: "Invalid request"
                })
        }


    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Failed to fetch data"
        })
    }
}

exports.postStory = async (req, res, next) => {
    try {
        //console.log(req.body);
        const { short_des, title, html_content, charcount, topics, cover } = req.body;

        if (!short_des || !cover || !title || !html_content || !topics || topics.length === 0 || !charcount) {
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

        let readingTime = Math.round(charcount / 1000) + " min";
        const story = await Story.create({
            short_des,
            html_content,
            readingTime,
            title,
            cover,
            user: req.user.id
        });
        const tt = [];
        for (const t of topics) {
            let topic = await Topic.findOne({ name: t.toLowerCase() });
            if (!topic) {
                topic = await Topic.create({ name: t.toLowerCase() })
            }
            tt.push(topic._id);
            topic.stories.push(story._id);
            await topic.save();
        }
        story.topics = tt;
        await story.save();
        const user = await User.findById(req.user.id);
        if(user){
            user.story.push(story._id);
            await user.save();
        }
        console.log(story);
        if (req.user.followers.length > 0) {
            const Noti = await Notification.create({
                receiver: req.user.followers,
                sender: req.user.username,
                Message: `${req.user.username} has published a story | ${title}`,
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
        res.status(200).json({ success: true, url: Noti.url });
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.editYourDetail = async (req, res, next) => {
    try {
        const { cover, avatar, fullname, bio, website } = req.body;
        const fieldsToUpdate = {};
        if (cover) fieldsToUpdate.cover = cover;
        if (avatar) fieldsToUpdate.avatar = avatar;
        if (fullname) fieldsToUpdate.fullname = fullname;

        await User.findByIdAndUpdate(req.user.id, {
            $set: { ...fieldsToUpdate, bio, website }
        },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({ success: true });

    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const { password, otp } = req.body;
        const user = await User.findById(req.user.id);
        if (password.length < 6 || password.length > 20) {
            return next({
                message: "password should be 6-20 characters in length",
                statusCode: 400
            })
        }
        const OTPCheck = await OTPmodel.findOne({ type: "changepassword", email: req.user.email.toLowerCase() });
        if (OTPCheck) {
            const time = OTPCheck.Timetried;
            if (OTPCheck.OTP != otp) {
                OTPCheck.Timetried = time + 1;
                if (time >= 4) {
                    await OTPCheck.remove();
                }
                else {
                    await OTPCheck.save();
                }
                return next({
                    message: `Wrong OTP.Only ${4 - time} chances left`,
                    refreshPage: time >= 4
                })
            }
            else {
                const tempid = generateOTP(16);
                await user.updatePassword(password, tempid);
                const token = user.getJwtToken();
                await OTPCheck.remove();
                res.status(200).json({ success: true, token });
                return;
            }
        }
        else {
            return next({
                message: 'Invalid OTP',
                statusCode: 400
            })
        }
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.requestOTP = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return next({
                message: "No account found with this email",
                statusCode: 404
            })
        }
        const OTP = generateOTP(6);
        await OTPmodel.deleteMany({ email: req.user.email.toLowerCase(), type: "changepassword" });
        await OTPmodel.create({ email: req.user.email.toLowerCase(), OTP: OTP, type: "changepassword" });
        const template = generateTemplate({ type: "changepassword", data: { user, OTP } });
        sendMail("OTP for changing password", template.text, template.html, [req.body.email.toLowerCase()], (err, res) => {
            if (err) {
                return next({
                    message: "Email could not be sent",
                    statusCode: 500
                })
            }
            else {
                res.status(200).json({ success: true, message: "Enter the OTP sent to your email" });
            }
        });

    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.getFollowingStories = async (req, res, next) => {
    try {
        let stories = await Story.find({}).populate({
            path: "user",
            select: "username avatar"
        }).lean().exec();
        const currIndex = parseInt(req.query.currIndex);
        stories.reverse();
        stories = stories.slice(currIndex, currIndex + 5);

        for (const s of stories) {
            if (req.user) {
                s.isLiked = (s.likedBy.toString().indexOf(req.user.id) > -1);
                const isSaved = await SavedStory.findOne({ userid: req.user.id, story: s._id });
                s.isSaved = isSaved ? true : false;

                if (req.user.following.includes(s.user._id)) {
                    data.followingstories.push({ title: s.title, short_des: s.short_des, isSaved: s.isSaved, isLiked: s.isLiked, likesCount: s.likedBy.length, readingTime: s.readingTime, createdAt: s.createdAt, author: s.user, _id: s._id, cover: s.cover });
                }
            }

        }
        res.status(200).json({ success: true, stories, currIndex, isEnded: stories.length == 0 })
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Something went wrong"
        })
    }
}

exports.feed = async (req, res, next) => {
    try {
        const data = { explorestories: [], followingstories: [], trendingTopics: [], readingList: [], suggestedUser: [] };
        const stories = await Story.find({}).populate({
            path: "user",
            select: "username avatar"
        }).lean().exec();

        for (const s of stories) {
            if (req.user) {
                s.isLiked = (s.likedBy.toString().indexOf(req.user.id) > -1);
                const isSaved = await SavedStory.findOne({ userid: req.user.id, story: s._id });
                s.isSaved = isSaved ? true : false;

                if (req.user.following.includes(s.user._id)) {
                    data.followingstories.push({ title: s.title, short_des: s.short_des, isSaved: s.isSaved, isLiked: s.isLiked, likesCount: s.likedBy.length, readingTime: s.readingTime, createdAt: s.createdAt, author: s.user, _id: s._id, cover: s.cover });
                }
            }
            data.explorestories.push({ title: s.title, short_des: s.short_des, isSaved: s.isSaved, isLiked: s.isLiked, likesCount: s.likedBy.length, readingTime: s.readingTime, createdAt: s.createdAt, author: s.user, _id: s._id, cover: s.cover });
        }

        const readingList = await ReadingList.find({ userid: req.user.id }).populate({
            path: "story",
            select: "likedBy title short_des cover readingTime createdAt",
            populate: {
                path: "user",
                select: "username avatar"
            }
        });
        const reading_l = readingList.reverse().slice(0, 3);//first 3
        reading_l.forEach(async function (r) {
            if (req.user) {
                const isSaved = await SavedStory.findById({ story: r.story._id, userid: req.user.id });
                r.isSaved = isSaved ? true : false;
                r.isLiked = (r.story.likedBy.toString().indexOf(req.user.id) > -1);
            }
        })
        data.readingList = reading_l;
        let trendingTopics = await Topic.find({});
        trendingTopics = trendingTopics.sort(function (a, b) {
            return b.followedBy.length - a.followedBy.length;
        });
        trendingTopics = trendingTopics.slice(0, 7);
        for (x of trendingTopics) {
            s.trendingTopics.push(x.name);
        }
        let users = await User.find({}).lean().exec();
        users = users.slice(0, 4);
        users.forEach(function (u) {
            if (req.user)
                u.isFollowing = req.user.following.includes(u._id);
            data.suggestedUser.push({ bio: u.bio, fullname: u.fullname, username: u.username, avatar: u.avatar, isFollowing: u.isFollowing });
        })

        res.status(200).json({ success: true, data, unseennotice: req.user.unseennotice.length });
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.sendNotice = async (req, res, next) => {
    try {
        const notices = await Notification.find({ receiver: { $in: [req.user.id] } }).sort({ createdAt: -1 });
        await User.findByIdAndUpdate(req.user.id, {
            $set: { unseennotice: [] }
        });
        res.status(200).json({ success: true, unseennotice: 0, notices: notices.slice(parseInt(req.query.currIndex), parseInt(req.query.currIndex) + 10) });
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.togglefollowPeople = async (req, res, next) => {
    try {
        const { uid } = req.body;
        console.log(uid);
        if (uid === req.user.id) {
            return next({ message: "Invalid request", statusCode: 400 });
        }
        const u = await User.findById(uid);
        if(!u){
            return next({message:"User not found",statusCode:400})
        }
        
        if (req.user.following.includes(uid)) {

            await User.findByIdAndUpdate(uid, {
                $pull: { followers: req.user.id },
            })
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { following: uid }
            });
            
            await Notification.deleteMany({ sender: req.user.username, receiver: [uid], type: "followuser" }, (err, res) => {
                if (err) {
                    console.log(err);
                }
            })
            res.status(200).json({ success: true, unseennotice: req.user.unseennotice.length, });
        }
        else {
            const noti = await Notification.create({
                sender: req.user.username,
                receiver: [uid],
                Message: `${req.user.username} started following you`,
                type: "followuser",
                url: `/${req.user.username}`,
                avatar: `${req.user.avatar}`,
            })
            await User.findByIdAndUpdate(uid, {
                $push: { followers: req.user.id, unseennotice: noti._id }
            })
            await User.findByIdAndUpdate(req.user.id, {
                $push: { following: uid }
            })
            res.status(200).json({ success: true, unseennotice: req.user.unseennotice.length, });
        }
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.togglefollowTopic = async (req, res, next) => {
    try {
        console.log(req.user);
        const topic = await Topic.findOne({ name: req.body.name });
        if (!topic) {
            return next({
                statusCode: 404,
                message: "This topic was not found"
            })
        }
        const index = topic.followedBy.indexOf(req.user.id);
        if (index > -1) {
            topic.followedBy.splice(index, 1);
            await topic.save();
            await User.findByIdAndUpdate(req.user.id, {
                $pull: { preferredTopics: topic.name }
            })
        }
        else {
            topic.followedBy.push(req.user.id);
            await topic.save();
            await User.findByIdAndUpdate(req.user.id, {
                $push: { preferredTopics: topic.name }
            })
        }
        res.status(200).json({ success: true, unseennotice: req.user.unseennotice.length, });

    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.searchUser = async (req, res, next) => {
    try {
        if (!req.body.term) {
            return next({
                message: "Search term is required",
                statusCode: 400
            });
        }
        const currIndex = parseInt(req.query.currIndex);
        ////console.log(req.user);
        const regex = new RegExp(req.body.term, "i");
        let data2 = [];
        User.find({ $or: [{ fullname: regex }, { username: regex }] }).select("username fullname avatar").lean().exec().then((data) => {
            if (req.user) {
                data2 = data.filter(function (d) {
                    return d.username != req.user.username;
                }).slice(currIndex, currIndex + 10);
                data2.forEach(function (d) {
                    d.isFollowing = req.user.following.includes(d._id);
                })
            }
            else{
                data2 = data.slice(currIndex, currIndex + 10);
            }
            res.status(200).json({ success: true, users: data2 });
        });
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}
exports.togglesaveStory = async (req, res, next) => {
    try {
        const isSaved = await SavedStory.findOne({ story: req.params.sid, userid: req.user.id });
        console.log("isSaved", isSaved);
        if (isSaved) {
            await isSaved.remove();
        }
        else {
            await SavedStory.create({ story: req.params.sid, userid: req.user.id });
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
exports.addToReadingList = async (req, res, next) => {
    try {
        await ReadingList.deleteOne({ story: req.params.sid, userid: req.user.id }, (err, res) => {
            if (err)
                console.log(err)
        });
        await ReadingList.create({ story: req.params.sid, userid: req.user.id });

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

exports.removeFromReadingList = async (req, res, next) => {
    try {
        await ReadingList.deleteOne({ story: req.params.sid, userid: req.user.id }, (err, res) => {
            if (err)
                console.log(err)
        });


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

exports.getSuggestedStory = async (req, res, next) => {
    try {
        // if(req.user)
        // await User.findByIdAndUpdate(req.user.id,{
        //     $pull:{following:null}
        // })
        let stories = await Story.find({}).select("user short_des likedBy topics title cover readingTime createdAt").populate({
            path: "user",
            select: "username avatar"
        }).populate({
            path: "topics",
            select: "name"
        }).lean().exec();
        const currIndex = parseInt(req.query.currIndex);
        if (!req.user) {
            stories.reverse();
            data = stories.slice(currIndex, currIndex + 5);
            res.status(200).json({ success: true, stories: data, currIndex: currIndex, isEnded: data.length == 0 });
            //console.log("processing...");
            return;
        }
        let data2 = [];

        stories.forEach(function (t) {
            for (const i of t.topics) {
                if (req.user.preferredTopics.indexOf(i.name) > -1) {
                    t.topics = [];
                    t.reason = "you like " + i.name;
                    data2.push(t);
                    break;
                }
            }

        });
        if (data2.length < 4) {
            data2 = data2.concat(stories);
        }
        data2.reverse();
        //filter duplicate
        data2 = data2.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                    t._id === thing._id
            ))
        )
        data2 = data2.slice(currIndex, currIndex + 5);
        data2.forEach(async function (t) {
            //console.log("---->", t._id);
            const isSaved = await SavedStory.findOne({ userid: req.user.id, story: t._id });
            //console.log("---->save", isSaved);
            t.isSaved = isSaved ? true : false;
            t.isLiked = t.likedBy.toString().includes(req.user.id);
            t.likesCount = t.likedBy.length;
            t.likedBy = [];
        })
        setTimeout(function () {
            res.status(200).json({ success: true, stories: data2 });
        }, 100)

    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.getSuggestedUser = async (req, res, next) => {
    const limit = parseInt(req.query.limit);
    console.log(req.user);
    try {
        let userst = await User.find({}).select("username avatar bio followers").lean().exec();
        //console.log("userst",userst)
        if (!req.user || (req.user && req.user.following.length === 0 && req.user.preferredTopics.length === 0)) {

            if (req.user) {
                //console.log("from here ",userst)
                userst = userst.filter(function (a) {
                    return a.username != req.user.username && !a.followers.toString().includes(req.user.id);
                })
            }
            userst = userst.slice(0, limit);
            userst.forEach(function (user) {

                user.followers = [];
            })
            res.json({ success: true, users: userst.slice(0, 5) });
            return;
        }
        else {
            let users = [];
            for (const t of req.user.preferredTopics.reverse().slice(0, 2)) {
                const topic = await Topic.findOne({ name: t }).populate({
                    path: "followedBy",
                    select: "username avatar bio followers"
                });
                if(topic)
                    users = users.concat(topic.followedBy);
            }
            //req.user.following.reverse();
            for (const f of req.user.following.slice(0, 10)) {
                console.log(f);
                const u = await User.findById(f).populate({
                    path: "following",
                    select: "username avatar bio followers"
                });
                
                users = users.concat(u.following);
                
            }
            users = users.concat(userst);
            users = users.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                    t._id === thing._id
            ))
        )
            users = Array.from(new Set([...users])).filter(function (a) { return (!a.followers.includes(req.user.id)) && (a.username != req.user.username) }).slice(0, limit);
            users = users.filter(function (a) {
                return a.followers.toString().indexOf(req.user.id) == -1
            })
            console.log(users);
            users.forEach(function (t) {
                t.followers = [];
            })
            res.status(200).json({ success: true, users })
        }
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}

exports.getsuggestedTopic = async (req, res, next) => {
    try {
        const priority = async (a, b, c) => {
            let prty = 0;
            for (const i of b) {
                const user = await User.findById(i);
                if (user.preferredTopics.includes(a.name)) {
                    prty++;
                }
            }
            for (const s of a.stories) {
                for (const t of s.topics) {
                    if (c.toString().includes(t.name)) {
                        prty = prty + 2;//give more weightage if it is related to preferredTopics
                    }
                }
            }
            console.log(a.name + "---->" + prty)
        }
        const currIndex = parseInt(req.query.currIndex);
        if (req.query.trending) {
            topics = await Topic.find({}).select("name followedBy cover stories").populate({
                path: "stories",
                select: "cover"
            }).lean().exec();
            topics = topics.sort(function (a, b) {
                return b.followedBy.length - a.followedBy.length;
            });
            topics = topics.slice(0, 8);
            await Topic.deleteMany({stories:[]},(err,res)=>{
                
            })
            topics.forEach(function (a) {
                if (!a.cover&&a.stories.length>0) {
                    a.cover = a.stories[a.stories.length - 1].cover;
                    
                }
                a.stories = [];
                a.followedBy = [];
            });
            res.status(200).json({ success: true, topics });
            return;
        }
        if (!req.user) {
            topics = await Topic.find({}).select("name followedBy cover stories").populate({
                path: "stories",
                select: "cover"
            }).lean().exec();
            topics = topics.sort(function (a, b) {
                return b.followedBy.length - a.followedBy.length;
            });
            topics = topics.slice(currIndex, currIndex + 10);
            topics.forEach(function (a) {
                if (!a.cover) {
                    a.cover = a.stories[a.stories.length - 1].cover;
                    a.stories = [];

                }
                a.isFollowing = false;
                a.followedBy = [];
            });
            res.status(200).json({ success: true, topics });
            return;
        }
        topics = await Topic.find({}).populate({
            path: "stories",
            select: "topics cover",
            populate: {
                path: "topics",
                select: "name"
            }
        }).lean().exec();
        topics = topics.sort(function (a, b) {
            return priority(a, req.user.following.reverse(), req.user.preferredTopics.reverse()) - priority(b, req.user.following.reverse(), req.user.preferredTopics.reverse());
        });

        topics = topics.slice(currIndex, currIndex + 10);
        topics.forEach(function (a) {
            if (!a.cover) {
                a.cover = a.stories[a.stories.length - 1].cover;
            }
            a.isFollowing = (req.user.preferredTopics.includes(a.name));
            a.followedBy = [];
            a.stories = [];
        });
        res.status(200).json({ success: true, topics });

    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Action failed"
        })
    }
}



