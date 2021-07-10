const OTPmodel = require("../models/OTPmodel");
const User = require("../models/User");
const { generateOTP } = require("../services/generateOTP");
const { generateTemplate } = require("../services/generateTemplate");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../services/Mailer");

exports.signup = async (req, res, next) => {
    try {
        let { fullname, username, email,password } = req.body;
        if (!fullname || !username || !email||!password) {
            return next({
                message: "Please fill all fields",
                statusCode: 400
            })
        }
        if ((/^[a-z0-9]+$/i).exec(username) == null) {
            return next({
                message: "username should only contain letter and digit",
                statusCode: 400
            })
        }
        if (username.length<7) {
            return next({
                message: "username should contain atleast 7 characters",
                statusCode: 400
            })
        }
        if(username=="trending"||username=="newstory"||username=="stories"){
            return next({
                message:"This username is not available",
                statusCode:400
            })
        }
        //regex for email

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!re.test(String(email).toLowerCase())){
            return next({
                message:"Email is invalid",
                statusCode:400,
            })
        }

        const checkIfEmailAlreadyRegistered = await User.findOne({email:email.toLowerCase()});
        if(checkIfEmailAlreadyRegistered){
            return next({
                statusCode:403,
                message:"Email is already registered"
            })
        }

        const checkIfUsernameTaken = await User.findOne({username});
        if(checkIfUsernameTaken){
            return next({
                statusCode:403,
                message:"Username is already taken"
            })
        }

        //verify password length

        if (password.length < 6 || password.length > 12) {
            return next({
                message: "Password length should be in range 6-12"
            })
        }

        const tempid = generateOTP(16);
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(password, salt);
        const user = await User.create({ fullname, username,tempid, email, password:pass });
        const token = user.getJwtToken();

        res.status(200).json({ success: true,token: token,authdata:{ avatar, username, fullname, email, _id, website, bio, cover } = user});


    }
    catch (e) {
        console.log(e);
        console.log(e);
        return next({
            statusCode: 500,
            message: "Request failed"
        })
    }
}

exports.login = async (req, res, next) => {
    try {
        let { password, email } = req.body;
        let user;
        if (!email || !password) {
            return next({
                statusCode: 400,
                message: "Please fill your credentials"
            })
        }
        if (email.indexOf('@') > -1) {
            user = await User.findOne({ email:email.toLowerCase() });
        }
        else {
            user = await User.findOne({ username: email });
        }
        if (!user) {
            return next({
                statusCode: 404,
                message: "User not found"
            })
        }
        console.log(password);
        const correct = await user.checkPassword(password);

        if (!correct) {
            return next({
                message: "Password is incorrect"
            })
        }
        else {
            if (user.twofactorEnabled) {
                const OTP = generateOTP(6);
                const template = generateTemplate({ type: "two-factor-login", data: { user, OTP } });
                await OTPmodel.deleteMany({ email: user.email.toLowerCase(), type: "2-factor-login" }, (err, res) => { });
                //OTP expires in 5 min
                await OTPmodel.create({ email:user.email.toLowerCase(), OTP, type: "2-factor-login" });
                sendMail("OTP for login", template.text, template.html, [email.toLowerCase()], (err, res) => {
                    if (err) {
                        return next({
                            statusCode: 500,
                            message: "Email could not be sent"
                        })
                    }
                })
                res.status(200).json({ success: true, verifyotp: true,data:user.email });
                return;
            }
            else {
                const token = user.getJwtToken();
                
                res.status(200).json({ success: true, token: token ,authdata:{ avatar, username, fullname, email, _id, website, bio, cover } = user});
            }
        }
    }
    catch (e) {
        console.log(e);
        console.log(e);
        return next({
            statusCode: 500,
            message: "Login failed"
        })
    }
}

exports.me = async (req, res, next) => {
    console.log('me', req.user);
    const { avatar, username, fullname, email, _id, website, bio, cover } = req.user;

    res.status(200).json({
        success: true,
        data: { avatar, username, fullname, email, _id, website, bio, cover },
    });

}

exports.changepassword = async (req, res, next) => {

    try {
        let { email, password, OTP } = req.body;
        if (!email || !password || !OTP) {
            return next({
                message: "Blank credential not allowed"
            })
        }
        if (password.length < 6 || password.length > 12) {
            return next({
                message: "Password length should be in range 6-12"
            })
        }
        const OTPCheck = await OTPmodel.findOne({ email:email.toLowerCase(), type: "forgot_password" });
        if (OTPCheck) {
            const time = OTPCheck.Timetried;
            if (OTPCheck.OTP != OTP) {
                OTPCheck.Timetried = time + 1;
                if (time >= 4) {
                    await OTPCheck.remove();
                }
                else {
                    await OTPCheck.save();
                }
                return next({
                    message: `Wrong OTP.Only ${4 - time} chances left`,
                    refreshPage:time==4
                })
            }
            else {
                const user = await User.findOne({ email:email.toLowerCase() });
                const tempid = generateOTP(16);
                await user.updatePassword(password,tempid);
                await user.save();                
                const token = user.getJwtToken();
                await OTPCheck.remove();
                res.status(200).json({ success: true,token,authdata:{ avatar, username, fullname, email, _id, website, bio, cover } = user});
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

exports.requestOTPForPwChange = async (req, res, next) => {
    try {
        const email = req.body.email.toLowerCase();
        console.log(email);
        const user = await User.findOne({ email: email });
        if (!user) {
            return next({
                message: "No account found with this email",
                statusCode: 404
            })
        }
        const OTP = generateOTP(6);
        //console.log(OTP);
        await OTPmodel.deleteMany({ email: email, type: "forgot_password" });
        await OTPmodel.create({ email: email, OTP: OTP, type: "forgot_password" });
        const template = generateTemplate({ type: "recover-account", data: { user, OTP } });
        sendMail("OTP for recovering account", template.text, template.html, [email], (err, re) => {
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

exports.twoFactorOtpVerify = async (req, res, next) => {

    try {
        const { email, OTP } = req.body;
        const type = "2-factor-login";
        const twofactorOTP = await OTPmodel.findOne({ email:email.toLowerCase(), type });
        if (!twofactorOTP) {
            return next({
                message: "No OTP found with this email",
                statusCode: 400
            })
        }
        else if (twofactorOTP.OTP != OTP) {
            twofactorOTP.Timetried = twofactorOTP.Timetried + 1;
            if (twofactorOTP.Timetried >= 5) {
                await twofactorOTP.remove();
            }
            else {
                await twofactorOTP.save();
            }
            return next({
                message: `Wrong OTP.Only ${5 - twofactorOTP.Timetried} chances left`,
                refreshPage: twofactorOTP.Timetried == 5,
                statusCode: 400,

            })
        }
        else {
            const user = await User.findOne({ email:email.toLowerCase() });
            const token = user.getJwtToken();
            await twofactorOTP.remove();
            res.status(200).json({ success: true, token,authdata:{ avatar, username, fullname, email, _id, website, bio, cover } = user});
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