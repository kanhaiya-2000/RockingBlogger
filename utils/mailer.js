var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
       user: process.env.EMAIL,
       pass: process.env.EMAIL_PASS
    }
  });

module.exports = transporter;