const jwt = require("jsonwebtoken");
const Userdb = require("../models/User");

exports.VerifyWithoutThrowingError = async(req,res,next)=>{    

    try{
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const user = await Userdb.findOne({_id:decoded.id}).populate({
                path:"unseennotice",
                select:"sender"
            });
            //console.log(decoded.tempid);
            if(user&&user.tempid!=decoded.tempid){//This is the only exception to this method
                return next({
                    logout:true,
                    message:"Please login again",
                    statusCode:403
                })
            }
            req.user = user;
            
        }
        next();
    }
    catch(e){
        console.log("line-28,middleware/auth.js",e);
        next();
    }

}

exports.Verify = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next({
            message: "Please login to continue further",//redirect to login
            statusCode: 403,
            logout: true
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //console.log(decoded);
        const User = await Userdb.findById(decoded.id).populate({
            path:"unseennotice",
            select:"sender"
        });
        ////console.log('\nuser',User);
        if (!User) {
            return next({ message: `No User found for ID ${decoded.id} and tempid ${decoded.tempid}`, logout: true });
        }
        User.password = null;
        if (!decoded.tempid || !User.tempid) {
            return next({ message: `Please login again to continue`, logout: true });
        }

        if (User.tempid != decoded.tempid) {
            return next({
                message: "Your session expired.Please login again",
                logout: true
            })
        }
        
        //console.log("Verify",User);
        req.user = User;

        next();

    } catch (err) {        
            next({
                logout:true,
                message: err.message,//refresh the page on frontend
                statusCode: 403,
        });    
    }
};