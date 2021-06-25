const express = require("express");
const { getUser, postStory, editYourDetail, changePassword, requestOTP, feed, sendNotice, togglefollowPeople, togglefollowTopic, searchUser, getSuggestedStory,  togglesaveStory, removeFromReadingList, addToReadingList, getUserData } = require("../controllers/user");

const router = express.Router();

const { Verify } = require("../middleware/auth");

router.route("/:uid").post(getUser);
router.route("/addstory").post(Verify,postStory);
router.route("/").put(Verify,editYourDetail);
router.route("/changepassword").post(Verify,changePassword);
router.route("/requestOTP").post(Verify,requestOTP);
router.route("/").post(feed);//authenticate the user in controller part
router.route("/getnotice").post(Verify,sendNotice);
router.route("/togglefollowpeople").post(Verify,togglefollowPeople);
router.route("/togglefollowtopic").post(Verify,togglefollowTopic);
router.route("/search").post(searchUser);
router.route("/addtoreadinglist/:sid").post(Verify,addToReadingList);
router.route("/togglesavestory/:sid").post(Verify,togglesaveStory);
router.route("/removefromreadinglist/:sid").post(Verify,removeFromReadingList);
router.route("/getuserdata/:uid").post(Verify,getUserData);
router.route("/getsuggestedstory").post(getSuggestedStory);



module.exports = router;