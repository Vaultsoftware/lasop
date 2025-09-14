// routes/certificate/postCert.js
require('dotenv').config();

const mongoose = require('mongoose');
const Certificate = require("../../models/certificate");
const Student = require("../../models/student");
const multer = require('multer');
const { storage } = require('../../config/firebaseConfig');
const nodemailer = require('nodemailer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_RECIEVE,
    pass: process.env.EMAIL_PWD,
  },
});

const postCert = async (req, res) => {
  try {
    const { studentId, certTitle } = req.body;
    const certificate = req.file;

    if (!certificate) return res.status(400).json({ error: 'No certificate file uploaded.' });
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: 'Invalid studentId.' });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    const bucket = bucketName ? storage.bucket(bucketName) : storage.bucket();
    if (!bucket || !bucket.name) {
      return res.status(500).json({
        error: 'Storage bucket not configured',
        details: { bucketName: bucketName || '(default)' },
      });
    }

    const safeName = `${studentId}_${Date.now()}_${certificate.originalname}`.replace(/[^\w.-]/g, '_');
    const file = bucket.file(`certificates/${safeName}`);

    try {
      await file.save(certificate.buffer, {
        resumable: false,
        contentType: certificate.mimetype,
        metadata: { contentType: certificate.mimetype },
      });
    } catch (saveErr) {
      console.error('GCS save error:', saveErr);
      return res.status(500).json({
        error: 'Failed to upload file',
        details: { message: saveErr.message, code: saveErr.code },
      });
    }

    const useEmu =
      process.env.USE_FIREBASE_EMULATOR === '1' ||
      Boolean(process.env.FIREBASE_STORAGE_EMULATOR_HOST);

    let fileUrl;
    if (useEmu) {
      const host = process.env.FIREBASE_STORAGE_EMULATOR_HOST || '127.0.0.1:9199';
      fileUrl = `http://${host}/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
    } else {
      try {
        await file.makePublic();
        fileUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(file.name)}`;
      } catch (permErr) {
        console.warn('makePublic failed, using signed URL:', permErr?.message || permErr);
        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: '2500-01-01',
        });
        fileUrl = signedUrl;
      }
    }

    const certificateData = await Certificate.create({
      studentId,
      certTitle,
      certificate: fileUrl,
    });

    transporter
      .sendMail({
        from: process.env.EMAIL_RECIEVE,
        to: student.email,
        subject: `Congratulations, You've received your certificate from Lasop`,
        text: `Congratulations on completing your ${certTitle} course, Your certificate is now available for you to view in your dashboard

Please click the link below to login https://lasop.net/login

Faith Igboin,
Admission office,
Lagos School of Programming Limited
Ojodu-Berger, Lagos.
+2347025713326`,
      })
      .catch((e) => console.error('Email send failed (continuing):', e));

    return res.status(201).json({
      message: 'Certificate created successfully',
      data: certificateData,
      bucket: bucket.name,
    });
  } catch (error) {
    console.error('postCert fatal error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};

module.exports = { postCert, upload };
