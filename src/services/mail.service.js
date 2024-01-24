// tizp zmxe vesm wrma
const config = require("../config/config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: config.mail.googleAppEmail,
      pass: config.mail.googleAppPass,
    },
});

const sendEmail = function (email, subject, text) {
    const mailOptions = {
        from: config.mail.googleAppEmail,
        to: email,
        subject: subject,
        text: text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
}

const asyncSendEmail = async function (email, subject, text) {
    const mailOptions = {
        from: config.mail.googleAppEmail,
        to: email,
        subject: subject,
        text: text,
    };
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: ", error);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
}

module.exports = {
    transporter,
    sendEmail,
    asyncSendEmail,
}