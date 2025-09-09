require('dotenv').config();

const Syllabus = require('../../models/syllabus');
const multer = require('multer');
const { storage } = require('../../config/firebaseConfig'); 

const postSyllabus = async (req, res) => {
    const { sylTitle } = req.body;
    const sylFile = req.file

    try {
        if (!sylFile) {
            return res.status(400).json({ error: 'No syllabus file uploaded.' });
        }

        const bucket = storage.bucket();
        const file = bucket.file(`certificates/${encodeURIComponent(sylFile.originalname)}`);

        // Create a write stream to upload the file
        const stream = file.createWriteStream({
            metadata: {
                contentType: sylFile.mimetype,
            },
        });

        // Handle errors during the upload
        stream.on('error', (err) => {
            return res.status(500).json({ error: 'Failed to upload file', details: err.message });
        });

        stream.on('finish', async () => {
            // Get the public URL of the uploaded file
            const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;

            // Create the syllabus document with the correct URL
            const syllabusData = await Syllabus.create({
                sylTitle: sylTitle,
                sylFile: fileUrl
            });

            res.status(201).json({
                message: 'Syllabus created successfully',
                data: syllabusData
            });
        });

        // Write the file buffer to the storage
        stream.end(sylFile.buffer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = postSyllabus;