const express = require("express");
const { getUser, postStory, editYourDetail, changePassword, requestOTP, feed, sendNotice, togglefollowPeople, togglefollowTopic, searchUser, getSuggestedStory,  togglesaveStory, removeFromReadingList, addToReadingList, getUserData, getFollowingStories, getSuggestedUser, getsuggestedTopic } = require("../controllers/user");

const router = express.Router();

const { Verify, VerifyWithoutThrowingError } = require("../middleware/auth");


router.route("/addstory").post(Verify,postStory);
router.route("/").put(Verify,editYourDetail);
router.route("/changepassword").post(Verify,changePassword);
router.route("/requestOTP").get(Verify,requestOTP);
router.route("/").post(VerifyWithoutThrowingError,feed);
router.route("/getnotice").get(Verify,sendNotice);
router.route("/togglefollowpeople").post(Verify,togglefollowPeople);
router.route("/togglefollowtopic").post(Verify,togglefollowTopic);
router.route("/search").post(VerifyWithoutThrowingError,searchUser);

router.route("/getuserdata/:uid").get(VerifyWithoutThrowingError,getUserData);
router.route("/getfollowingstory").get(VerifyWithoutThrowingError,getFollowingStories);
router.route("/getsuggestedstory").get(VerifyWithoutThrowingError,getSuggestedStory);
router.route("/getsuggesteduser").get(VerifyWithoutThrowingError,getSuggestedUser);
router.route("/getsuggestedtopic").get(VerifyWithoutThrowingError,getsuggestedTopic);
router.route("/addtoreadinglist/:sid").get(Verify,addToReadingList);
router.route("/togglesavestory/:sid").get(Verify,togglesaveStory);
router.route("/removefromreadinglist/:sid").get(Verify,removeFromReadingList);
router.route("/:uid").get(VerifyWithoutThrowingError,getUser);
 


module.exports = router;