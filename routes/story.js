const express = require("express");
const { getStory, trendingStories, addComment,toggleLikeComment, reportStory, searchStory, editStory, toggleLike, deleteComment,getLatestStories,getPopularStories,getTopicDetail} = require("../controllers/story");
const router = express.Router();

const { Verify, VerifyWithoutThrowingError } = require("../middleware/auth"); 
 



router.route("/trending").get(VerifyWithoutThrowingError,trendingStories);
router.route("/togglelike").post(Verify,toggleLike);
router.route("/addcomment").post(Verify,addComment);
router.route("/togglelikecomment").post(Verify,toggleLikeComment);
router.route("/search").post(VerifyWithoutThrowingError,searchStory);
router.route("/deletecomment/:cid").delete(Verify,deleteComment);
router.route("/report/:sid").post(Verify,reportStory); 
router.route("/latest/:topic").get(VerifyWithoutThrowingError,getLatestStories);
router.route("/popular/:topic").get(VerifyWithoutThrowingError,getPopularStories);
router.route("/gettopicdetail/:topic").get(VerifyWithoutThrowingError,getTopicDetail);
router.route("/fetchcomments/:sid").get(VerifyWithoutThrowingError)
router.route("/:sid").get(VerifyWithoutThrowingError,getStory);
router.route("/:sid").put(Verify,editStory);



module.exports = router;