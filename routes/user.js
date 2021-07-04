const express = require("express");
const { getUser, postStory, editYourDetail, changePassword, requestOTP, feed, sendNotice, togglefollowPeople, togglefollowTopic, searchUser, getSuggestedStory,  togglesaveStory, removeFromReadingList, addToReadingList, getUserData, getFollowingStories } = require("../controllers/user");

const router = express.Router();

const { Verify, VerifyWithoutThrowingError } = require("../middleware/auth");

router.route("/:uid").get(VerifyWithoutThrowingError,getUser);
router.route("/addstory").post(Verify,postStory);
router.route("/").put(Verify,editYourDetail);
router.route("/changepassword").post(Verify,changePassword);
router.route("/requestOTP").post(Verify,requestOTP);
router.route("/").post(VerifyWithoutThrowingError,feed);//authenticate the user in controller part
router.route("/getnotice").get(Verify,sendNotice);
router.route("/togglefollowpeople").post(Verify,togglefollowPeople);
router.route("/togglefollowtopic").post(Verify,togglefollowTopic);
router.route("/search").post(VerifyWithoutThrowingError,searchUser);
router.route("/addtoreadinglist/:sid").post(Verify,addToReadingList);
router.route("/togglesavestory/:sid").post(Verify,togglesaveStory);
router.route("/removefromreadinglist/:sid").post(Verify,removeFromReadingList);
router.route("/getuserdata/:uid").get(VerifyWithoutThrowingError,getUserData);
router.route("/getfollowingstory").get(VerifyWithoutThrowingError,getFollowingStories);
router.route("/getsuggestedstory").get(VerifyWithoutThrowingError,getSuggestedStory);
router.route("/getsuggesteduser").get(VerifyWithoutThrowingError,getSuggestedUser);
router.route("/getsuggestedtopic").get(VerifyWithoutThrowingError,getSuggestedUser);
 


module.exports = router;