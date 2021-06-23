var transporter = require("../utils/mailer");

exports.sendMail = (subject,text,html,emailList,callback)=>{

    const mailOptions = {
        from:process.env.EMAIL,
        to:emailList,
        subject:subject,
        text:text,
        html:html
    }
    transporter.sendMail(mailOptions).then(()=>{
        console.log("Mail sent...");
        callback(null,true);
    }).catch(err=>{
        callback(err,false);
    })
}