const transporter = require("../utils/mailer");

exports.sendMail = (subject,text,html,emailList,callback)=>{

    const mailOptions = {
        from:process.env.EMAIL,
        to:emailList||["kanhaiya_k@cs.iitr.ac.in"],
        subject:subject,
        text:text,
        html:html
    }
    //console.log(mailOptions);
    transporter.sendMail(mailOptions).then(()=>{
        console.log("Mail sent...");
        callback(null,true);
    }).catch(err=>{
        console.log(err);
        callback(err,false);
    })
}