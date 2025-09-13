// routes/certificate/postCert.gridfs.js
require('dotenv').config();
const mongoose = require('mongoose');
const multer = require('multer');
const { ObjectId } = require('mongodb');
const { getBucket } = require('../../config/gridfs');
const Certificate = require('../../models/certificate');
const Student = require('../../models/student');
const nodemailer = require('nodemailer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_RECIEVE, pass: process.env.EMAIL_PWD },
});

async function postCert(req, res) {
  try {
    const { studentId, certTitle } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: 'No certificate file uploaded.' });
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid studentId.' });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const bucket = getBucket();
    const safeName = `${studentId}_${Date.now()}_${file.originalname}`.replace(/[^\w.-]/g, '_');

    const uploadStream = bucket.openUploadStream(safeName, {
      contentType: file.mimetype || 'application/octet-stream',
    });

    uploadStream.end(file.buffer);

    uploadStream.on('error', (e) => {
      console.error('GridFS upload error:', e);
      return res.status(500).json({ error: 'Failed to upload file', detail: e.message });
    });

    uploadStream.on('finish', async () => {
      const fileId = uploadStream.id; // ObjectId
      const base = process.env.API_PUBLIC_BASE_URL || ''; // e.g. https://api.myapp.com
      const fileUrl = `${base}/files/${fileId.toString()}`;

      const certificateData = await Certificate.create({
        studentId,
        certTitle,
        certificate: fileUrl, // keep same field your UI uses
      });

      // fire-and-forget email (same as before)
      transporter
        .sendMail({
          from: process.env.EMAIL_RECIEVE,
          to: student.email,
          subject: `Congratulations, You've received your certificate from Lasop`,
          text: `Congratulations on completing your ${certTitle} course, Your certificate is now available for you to view in your dashboard

Please click the link below to login https://lasop-client.vercel.app/login

Faith Igboin,
Admission office,
Lagos School of Programming Limited
Ojodu-Berger, Lagos.
+2347025713326`,
        })
        .catch((e) => console.warn('Email send failed (continuing):', e?.message || e));

      return res.status(201).json({
        message: 'Certificate created successfully',
        data: certificateData,
      });
    });
  } catch (err) {
    console.error('postCert fatal error:', err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}

module.exports = { upload, postCert };
