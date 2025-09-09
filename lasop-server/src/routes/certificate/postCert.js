require('dotenv').config();

const Certificate = require("../../models/certificate");
const Student = require("../../models/student"); 
const multer = require('multer');
const { storage } = require('../../config/firebaseConfig');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_RECIEVE,
        pass: process.env.EMAIL_PWD
    }
});

const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage
});

const postCert = async (req, res) => {
    const { studentId, certTitle } = req.body;
    const certificate = req.file;

    try {
        if (!certificate) {
            return res.status(400).json({ error: 'No certificate file uploaded.' });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        const studentEmail = student.email;

        const mailOptions = {
            from: process.env.EMAIL_RECIEVE,
            to: studentEmail,
            subject: `Congratulations, You've received your certificate from Lasop`,
            text: `Congratulations on completing your ${certTitle} course, Your certificate is now available for you to view in your dashboard \n\nPlease click the link below to login https://lasop-client.vercel.app/login \n\nFaith Igboin,\nAdmission office,\nLagos School of Programming Limited\nOjodu-Berger, Lagos.\n+2347025713326
            `
        };

        // Send welcome email to the student after account creation
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred while sending email:', error);
                return res.status(500).json({ message: 'Account created, but email could not be sent.' });
            }
        });

        const bucket = storage.bucket();
        const file = bucket.file(`certificates/${encodeURIComponent(certificate.originalname)}`);

        // Create a write stream to upload the file
        const stream = file.createWriteStream({
            metadata: {
                contentType: certificate.mimetype,
            },
        });

        // Handle errors during the upload
        stream.on('error', (err) => {
            return res.status(500).json({ error: 'Failed to upload file', details: err.message });
        });

        stream.on('finish', async () => {
            // Get the public URL of the uploaded file
            const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;

            // Create the certificate document with the correct URL
            const certificateData = await Certificate.create({
                studentId,
                certTitle,
                certificate: fileUrl
            });

            res.status(201).json({
                message: 'Certificate created successfully',
                data: certificateData
            });
        });

        // Write the file buffer to the storage
        stream.end(certificate.buffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
};

module.exports = { postCert, upload };
