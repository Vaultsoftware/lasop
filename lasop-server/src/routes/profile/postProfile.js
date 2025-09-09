require('dotenv').config();

const Profile = require('../../models/profile');
const Student = require("../../models/student"); 
const multer = require('multer');
const { storage } = require('../../config/firebaseConfig');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const postProfile = async (req, res) => {
    const { studentId } = req.body;
    const proPic = req.file;

    try {
        if(!proPic) {
            return res.status(400).json({ error: 'No picture uploaded' });
        }

        const student = await Student.findById(studentId);
        if(!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        const bucket = storage.bucket();
        const file = bucket.file(`certificates/${encodeURIComponent(proPic.originalname)}`)

        // A write stream to upload the file
        const stream = file.createWriteStream({
            metaData: {
                contentType: proPic.mimetype,
            },
        });

        // Handle errors during the upload
        stream.on('error', (err) => {
            return res.status(500).json({ error: 'Failed to upload file', details: err.message });
        })

        stream.on('finish', async () => {
            // Get the public url of uploaded file
            const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;

            // Check if profile exists
            const existingProfile = await Profile.findOne({ studentId });

            if (existingProfile) {
                // Update existing profile picture
                existingProfile.proPic = fileUrl;
                await existingProfile.save();

                return res.status(200).json({
                    message: 'Profile image updated successfully',
                    data: existingProfile
                });
             }
 

            // create the document with the correct URL
            const profilePicData =await Profile.create({
                studentId,
                proPic: fileUrl
            })

            res.status(201).json({
                message: 'Profile image uploaded successfully',
                data: profilePicData
            });
        });

        // Write the file buffer to the storage
        stream.end(proPic.buffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error);
    }
};

module.exports  = postProfile