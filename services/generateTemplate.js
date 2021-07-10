exports.generateTemplate = ({type,data})=>{
    let template = {text:"",html:""};
    switch(type){        
        case "recover-account":
            template.text=`Hello ${data.user.fullname},\nOTP to recover your account is ${data.OTP}.\nThis OTP will expire in 5 minutes.\nWishing you the best for your blogging experience,\n\nRegards\nTeam RockingBlogger\nIndia`;
            template.html=`<h4>Hello ${data.user.fullname}</h4>OTP to recover your account is <b>${data.OTP}.</b><br>This OTP will expire in <b>5 minutes</b>.<br>Wishing you the best for your blogging experience,<br><br>Regards<br>Team RockingBlogger<br>India`;;
            return template;
        case "report_story":
            template.text=`Hello admin,Reports against story ${data.title} posted by ${data.user.username} is increasing.Total reports filled have reached ${data.reportCount}\nClick ${process.env.SERVER_URL}/stories/${data._id} to view this story\nRegards\nRockingBlogger`;
            template.html=`<div>Hello <b>admin</b>,<br>Reports against story <b>${data.title}</b> posted by ${data.user.username} is increasing.<br>Total reports filled have reached ${data.reportCount}<br><br><br><a href=\`${process.env.SERVER_URL}/stories/${data._id}\` style="padding:5px;background:violet;text-decoration:none;color:white">Click</a> to view this story<br><br>Regards<br>RockingBlogger</div>`;
            return template;
        default:
            return template;
            
    }
}