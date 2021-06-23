const express = require("express");
const { getStory, trendingStories, addComment,toggleLikeComment, reportStory, searchStory, editStory, toggleLike } = require("../controllers/story");
const router = express.Router();

const { Verify } = require("../middleware/auth");

router.route("/:sid").post(getStory);
router.route("/trending").post(trendingStories);
router.route("/togglelike").post(Verify,toggleLike);
router.route("/addcomment").post(Verify,addComment);
router.route("/togglelikecomment").post(Verify,toggleLikeComment);
router.route("/report/:sid").post(Verify,reportStory);
router.route("/search/:term").post(searchStory);
router.route("/:sid").put(Verify,editStory);


module.exports = router;