const Story = require("../models/Story");
const User = require("../models/User");
const Topic = require("../models/Topic");

exports.deleteStory = async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.storyid);
        if (!story || (!req.user.isAdmin && story.user != req.user.id)) {
            return next({
                statusCode: 403,
                message: "Failed to delete story"
            })
        }
        for(const t of story.topics){
            const topic = await Topic.findById(t);
            if(topic&&topic.stories.length==1){
                await topic.remove();
            }
            else{
                await Topic.findByIdAndUpdate(t,{
                    $pull:{stories:story._id}
                })
            }

        }
        await Topic.deleteMany({stories:[]},(err,res)=>{
                
        })
        await story.remove();
        res.status(200).json({ success: true, message: "Story was deleted successfully" });
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Failed to delete story"
        })
    }

}

exports.deleteUserId = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userid);
        if (!user || (!req.user.isAdmin && user._id != req.user.id)) {
            return next({
                statusCode: 403,
                message: "Failed to delete account"
            })
        }
        await user.remove();
        res.status(200).json({ success: true, message: "Account was deleted successfully" });
    }
    catch (e) {
        console.log(e);
        return next({
            statusCode: 500,
            message: "Failed to delete account"
        })
    }
}