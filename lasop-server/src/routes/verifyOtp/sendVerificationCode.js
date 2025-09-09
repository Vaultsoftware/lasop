const VerifyOtp = require("../../models/verification");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Nodemailer setup
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_RECIEVE,
        pass: process.env.EMAIL_PWD
    }
});

// Function to generate a random 6-digit code
function generateCode() {
    return crypto.randomInt(100000, 999999).toString();
}

// Send verification code function
const sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        let emailEntry = await VerifyOtp.findOne({ email });

        // If the email already exists, update the code and expiration
        if (emailEntry) {
            const verificationCode = generateCode();
            emailEntry.code = verificationCode;
            emailEntry.codeExpiration = Date.now() + 10 * 60 * 1000;
            await emailEntry.save();
        } else {
            // If the email doesn't exist, create a new entry
            const verificationCode = generateCode();
            emailEntry = await VerifyOtp.create({
                email: email,
                code: verificationCode,
                codeExpiration: Date.now() + 10 * 60 * 1000
            });
        }

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_RECIEVE,
            to: email,
            subject: `Verification Code`,
            text: `Your verification code is ${emailEntry.code}. This code is valid for 10 minutes.`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred while sending email:', error);
                return res.status(500).json({ message: 'Verification code could not be sent.' });
            } else {
                return res.status(201).json({
                    message: 'Verification code sent',
                    data: emailEntry
                });
            }
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = sendVerificationCode;
