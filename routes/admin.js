const express = require("express");
const router = express.Router();
const { deleteUserId,deleteStory } = require("../controllers/admin");
const { Verify } = require("../middleware/auth");

router.route("/deleteStory/:storyid").delete(Verify,deleteStory);
router.route("/deleteUserId/:userid").delete(Verify,deleteUserId);

module.exports = router;