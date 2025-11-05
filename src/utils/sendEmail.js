const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Reusable function to send emails
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from : `"Your App Name" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
         console.log(`📧 Email sent to ${to}: ${info.messageId}`);
         return true;
    } catch(error){
        console.error("❌ Error sending email:", error.message);
        return false;
    }
}


module.exports = {sendEmail}