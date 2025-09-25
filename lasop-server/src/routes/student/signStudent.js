// ====================================================================
// 2) lasop-server/src/routes/student/signStudent.js
// ====================================================================
require('dotenv').config();

const path = require('path');
const Student = require('../../models/student');
const Cohort = require('../../models/cohort');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const express = require('express');
const multer = require('multer');
const { storage } = require('../../config/firebaseConfig');

const assetPath = (file) => path.join(process.cwd(), 'public', file);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function bool(val, def = false) {
  const s = String(val ?? '').trim().toLowerCase();
  if (s === '1' || s === 'true') return true;
  if (s === '0' || s === 'false') return false;
  return def;
}

function createWorkMailTransporter() {
  const host = (process.env.SMTP_HOST || '').trim();
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = bool(process.env.SMTP_SECURE, port === 465);

  if (!host || !user || !pass) throw new Error('SMTP_HOST/SMTP_USER/SMTP_PASS are required for sending mail');

  const tls = {};
  const servername = (process.env.SMTP_TLS_SERVERNAME || '').trim();
  if (servername) tls.servername = servername;
  if (process.env.SMTP_REJECT_UNAUTHORIZED != null) {
    tls.rejectUnauthorized = bool(process.env.SMTP_REJECT_UNAUTHORIZED, true);
  }

  return nodemailer.createTransport({ host, port, secure, auth: { user, pass }, tls });
}

let transporter;
try {
  transporter = createWorkMailTransporter();
} catch (e) {
  console.error('Mail transporter init failed:', e?.message || e);
}

/* -------- Premium HTML (inline CIDs) -------- */
const P = (html) => `<p style="margin:0 0 12px 0;font-size:14px;line-height:22px;color:#3a4152;">${html}</p>`;
const IMG = (cid, alt) => `<div style="margin:8px 0 14px 0;"><img src="cid:${cid}" alt="${alt}" width="100%" style="max-width:640px;border-radius:12px;border:1px solid #eef1f6;display:block;"></div>`;
function signatureHtml() {
  return `
  <div style="margin-top:18px;padding:14px 16px;border:1px solid #eef1f6;border-radius:12px;background:#fcfdff;">
    <div style="font-weight:600;color:#0b1532;font-size:14px;margin-bottom:2px;">Faith Igboin</div>
    <div style="color:#5b6477;font-size:12px;">Admissions Office</div>
    <div style="color:#5b6477;font-size:12px;">Lagos School of Programming Limited</div>
    <div style="color:#5b6477;font-size:12px;">Ojodu-Berger, Lagos</div>
    <div style="color:#0b1532;font-size:12px;margin-top:6px;">+234 702 571 3326</div>
  </div>`;
}
function wrapHtml({ title, tagRight, bodyHtml }) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title></head>
<body style="margin:0;background:#f6f8fb;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;">
<tr><td align="center" style="padding:24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:700px;background:#fff;border-radius:16px;border:1px solid #eef1f6;overflow:hidden;">
    <tr>
      <td style="background:#0b1532;color:#fff;padding:16px 20px;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
        <table role="presentation" width="100%"><tr>
          <td><img src="cid:logo@lasop" alt="LASOP" height="28" style="display:block;"></td>
          <td align="right" style="font-size:12px;opacity:.9;">${tagRight}</td>
        </tr></table>
      </td>
    </tr>
    <tr>
      <td style="padding:22px 24px;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1532;">
        ${bodyHtml}
        <div style="margin:22px 0 0 0;">
          <a href="https://www.lasop.net/login" style="display:inline-block;background:#0b5fff;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:600;">Open your dashboard</a>
        </div>
        <div style="margin:22px 0 0 0;height:1px;background:#eef1f6;"></div>
        ${signatureHtml()}
        <div style="padding-top:8px;color:#8a93a5;font-size:11px;text-align:center;">Automated message — please do not reply.</div>
      </td>
    </tr>
  </table>
  <div style="padding:16px 0 0 0;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#8a93a5;font-size:11px;">© ${new Date().getFullYear()} LASOP — All rights reserved.</div>
</td></tr></table></body></html>`;
}
function getWelcomeHtml(firstName, courseTitle) {
  const blocks = [];
  blocks.push(P(`Hi ${firstName}! We are glad that you have enrolled to be a student at our school.`));
  blocks.push(P(`Congratulations!`));
  // removed the "We welcome you to the Lagos School..." line
  blocks.push(P(`At LASOP, we provide high-quality training to equip our students with industry – recognized IT skills and the kind of knowledge that high achieving companies are looking for. Just as with any position, having people interested in the job is not enough for them to get hired. There may be existing programmers on the market, but their inexperience may make employers go for someone older in the game.`));
  blocks.push(IMG('img1@lasop', 'LASOP image')); // after “game.”
  blocks.push(P(`Therefore, it's not just the question of having a talent pool but also of talent level. Lack of practical experience and the lack of workplace experience are some of the problems faced by most first-time hires today.`));
  blocks.push(P(`To make sure you come out well polished, we have in long-term employment; industry experts waiting to be your tutors. This is to ensure that you do not struggle to understand your studies from the first day.`));
  blocks.push(IMG('img2@lasop', 'LASOP image')); // after “day.”
  blocks.push(P(`LASOP MENTORS! We don't just train. We follow up with your development and growth in the tech space by entertaining and providing answers to your questions and counselling you from time to time. As an alumni, you are always welcome to the school, and you can utilise any of our "free to use" facilities when you want to. You can know more about us by visiting <a href="https://www.lasop.net/about" style="color:#0b5fff;text-decoration:none;">lasop.net/about</a> or by visiting our campus.`));

  if (courseTitle === 'Fullstack Development') {
    blocks.push(P(`You will be taught on frontend and backend courses in a very organized manner and you will do really good at programming. More information on your courses can be found at: <a href="https://lasop.net/course/Fullstack" style="color:#0b5fff;text-decoration:none;">lasop.net/course/Fullstack</a>.`));
  } else if (courseTitle === 'Frontend') {
    blocks.push(P(`You will be taught frontend in a very organized manner and you will do really good at programming. More information on your courses can be found at: <a href="https://lasop.net/course/Frontend" style="color:#0b5fff;text-decoration:none;">lasop.net/course/Frontend</a>.`));
  } else if (courseTitle === 'Data Science And AI') {
    blocks.push(P(`You will be taught data science in a very organized manner, and you will do really well at analysis and artificial intelligence. More information on your courses can be found at: <a href="https://lasop.net/course/Data%20Science%20And%20AI" style="color:#0b5fff;text-decoration:none;">lasop.net/course/Data Science And AI</a>.`));
  } else if (courseTitle === 'Data Analytics') {
    blocks.push(P(`You will be taught data analysis in a very organized manner, and you will do really well at it in a matter of months. More information on your courses can be found at: <a href="https://lasop.net/course/Data%20Analytics" style="color:#0b5fff;text-decoration:none;">lasop.net/course/Data Analytics</a>.`));
  }

  blocks.push(P(`If you need to get in touch with anyone in the office, please use this link to view our contact address: <a href="https://www.lasop.net/contact" style="color:#0b5fff;text-decoration:none;">lasop.net/contact</a>.`));
  blocks.push(P(`Please dive into the student suite and explore the opportunities prepared for you! To log in with the email and password you used during registration, visit <a href="https://www.lasop.net/login" style="color:#0b5fff;text-decoration:none;">lasop.net/login</a>.`));
  blocks.push(P(`Congratulations once again, and I'm looking forward to hearing about your progress and success after your engagement with LASOP!`));

  return wrapHtml({ title: `Welcome to ${courseTitle} — LASOP`, tagRight: 'Welcome', bodyHtml: blocks.join('') });
}

/* -------- Controller (unchanged behavior) -------- */
const signStudent = async (req, res) => {
  const { firstName, lastName, email, password, contact, address, program, allowed, gender, status } = req.body;
  const profile = req.file;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);

    let fileUrl = null;

    const emailExist = await Student.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ message: 'Email already exists' });
    } else {
      if (profile) {
        const bucket = storage.bucket();
        const file = bucket.file(`certificates/${encodeURIComponent(profile.originalname)}`);

        const stream = file.createWriteStream({ metadata: { contentType: profile.mimetype } });

        stream.on('error', (err) => {
          return res.status(500).json({ error: 'Failed to upload file', details: err.message });
        });

        stream.on('finish', async () => {
          fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
        });

        stream.end(profile.buffer);
      }

      const cohort = await Cohort.findById(program.cohortId).populate({
        path: 'courseTutors',
        match: { course: program.courseId, center: program.center, mode: program.mode },
        select: 'tutors',
      });

      if (cohort && cohort.courseTutors.length > 0) {
        program.tutorId = cohort.courseTutors[0].tutors;
      } else {
        program.tutorId = 'pending';
      }

      const newStudent = new Student({
        firstName,
        lastName,
        email,
        password: hashPwd,
        contact,
        address,
        program,
        profile: fileUrl || '',
        gender,
        allowed,
        status,
      });

      const saveStudent = await newStudent.save();

      const populatedStudent = await saveStudent.populate({
        path: 'program.courseId',
        model: 'Course',
        select: 'title',
      });

      const courseTitle = populatedStudent.program.courseId.title;

      const fromEmail = 'no-reply@lasop.net';
      const fromName = (process.env.FROM_NAME || 'LASOP').trim();
      const from = `${fromName} <${fromEmail}>`;

      const html = getWelcomeHtml(firstName, courseTitle);

      const text = `Hi ${firstName}!

Congratulations!

Learn more: https://www.lasop.net/about
Contact: https://www.lasop.net/contact
Login: https://www.lasop.net/login

— Faith Igboin
Admissions Office
Lagos School of Programming Limited
Ojodu-Berger, Lagos
+2347025713326`;

      const mailOptions = {
        from,
        to: email,
        subject: `Welcome to ${courseTitle} at LASOP`,
        text,
        html,
        headers: { 'Auto-Submitted': 'auto-generated', 'X-Auto-Response-Suppress': 'All', Precedence: 'bulk' },
        envelope: { from: fromEmail, to: email },
        attachments: [
          { filename: 'lasop.png', path: assetPath('lasop.png'), cid: 'logo@lasop' },
          { filename: 'email1.png', path: assetPath('email1.png'), cid: 'img1@lasop' },
          { filename: 'email2.png', path: assetPath('email2.png'), cid: 'img2@lasop' },
        ],
      };

      if (transporter) {
        transporter.sendMail(mailOptions).catch((error) => {
          console.error('Error occurred while sending email:', error);
        });
      }

      return res.status(201).json({
        message: 'Account created successfully and confirmation email sent!',
        data: saveStudent,
      });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = signStudent;
