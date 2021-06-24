const express = require("express");
const router = express.Router();
const { login, signup, me, changepassword, requestOTPForPwChange, twoFactorOtpVerify } = require("../controllers/auth");
const { Verify } = require("../middleware/auth");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/me").get(Verify, me);
router.route("/changepassword").post(changepassword);
router.route('/recoveryOTP').post(requestOTPForPwChange);
router.route('/twoFactorOtpVerify').post(twoFactorOtpVerify);

module.exports = router;