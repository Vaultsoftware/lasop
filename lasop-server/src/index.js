// =============================================================
// File: lasop-server/src/index.js  — FULLY SYNCED + FACEBOOK API
// =============================================================
require('dotenv').config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { connection } = require("./config/connection");

/* ============================ Route imports ============================ */
// Student
const signStudent = require("./routes/student/account/signStudent");
const logStudent = require("./routes/student/account/logStudent");
const updateStudent = require("./routes/student/account/updateStudent");
const delStudent = require("./routes/student/account/delStudent");
const getStudentDet = require("./routes/student/account/getStudentDet");
const getStudent = require("./routes/student/account/getStudents");
const addCourseStudent = require("./routes/student/onboard/addCourseStudent");
const fetchStudentByStatus = require("./routes/student/onboard/fetchStudentByStatus")

// Job
const postJob = require("./routes/admin/job/postJob");
const getJob = require("./routes/admin/job/getJob");
const updateJob = require("./routes/admin/job/updateJob");
const delJob = require("./routes/admin/job/delJob");

// Cohort Message
const postCohortMessage = require('./routes/cross/cohortChat/postCohortMessage.js');
const getCohortMessages = require('./routes/cross/cohortChat/getCohortMessages.js');
const deleteCohortMessage = require('./routes/cross/cohortChat/deleteCohortMessage.js');

// Group Message
const postGroupMessage = require('./routes/cross/groupChat/postGroupMessage.js');
const getGroupMessages = require('./routes/cross/groupChat/getGroupMessages.js');
const deleteGroupMessage = require('./routes/cross/groupChat/deleteGroupMessage.js');

// Admin
const logUser = require("./routes/admin/account/logUser");
const signUser = require("./routes/admin/account/signUser");
const updateUser = require("./routes/admin/account/updateUser");
const delUser = require("./routes/admin/account/delUser");

// Cohort
const postCohort = require("./routes/admin/cohort/postCohort");
const getCohort = require("./routes/admin/cohort/getCohort");
const updateCohort = require("./routes/admin/cohort/updateCohort");
const delCohort = require("./routes/admin/cohort/delCohort");
const getCohortDetails = require("./routes/admin/cohort/getCohortId");
const fetchCohortsByCourse = require('./routes/admin/cohort/fetchCohortsByCourse.js');

// Syllabus
const postSyllabus = require("./routes/admin/syllabus/postSyllabus");
const getSyllabus = require("./routes/admin/syllabus/getSyllabus");
const updateSyllabus = require("./routes/admin/syllabus/updateSyllabus");
const delSyllabus = require("./routes/admin/syllabus/delSyllabus");

// Course
const postCourse = require("./routes/admin/course/postCourse");
const getCourse = require("./routes/admin/course/getCourse");
const getCourseDetails = require("./routes/admin/course/getCourseId");
const updateCourse = require("./routes/admin/course/updateCourse");
const delCourse = require("./routes/admin/course/delCourse");

// Exam
const postExam = require("./routes/admin/exam/postExam");
const getExam = require("./routes/admin/exam/getExam");
const updateExam = require("./routes/admin/exam/updateExam");
const delExam = require("./routes/admin/exam/delExam");
const postCohortExam = require("./routes/admin/cohortExam/postCohortExam");
const getCohortExam = require("./routes/admin/cohortExam/getCohortExam");
const getCohortExamDet = require("./routes/admin/cohortExam/getCohortExamDet");

// Center
const postCenter = require("./routes/cross/center/postCenter");
const getCenter = require("./routes/cross/center/getCenter");

// Staff route
const postStaff = require("./routes/staff/account/postStaff");
const getStaff = require("./routes/staff/account/getStaff");
const getStaffId = require("./routes/staff/account/getStaffId");
const updateStaffDet = require("./routes/staff/account/updateStaffDet");
const postOtherInfo = require("./routes/staff/account/postOtherInfo");
const getOtherInfo = require("./routes/staff/account/getOtherInfo");
const getOtherInfoDet = require("./routes/staff/account/getOtherInfoDet");
const updateOtherInfo = require("./routes/staff/account/updateOtherInfo");
const fetchStaffByRole = require('./routes/staff/account/fetchStaffByRole.js');

// Assessment result
const postResult = require("./routes/admin/result/postResult");
const getResult = require("./routes/admin/result/getResult");
const getResultDetail = require("./routes/admin/result/getResultDetails");

// Assessment
const postAssessment = require("./routes/staff/assessment/postAssessment");
const getAssessment = require("./routes/staff/assessment/getAssessment");
const delAssessment = require("./routes/staff/assessment/delAssessment");
const getAssessmentDetail = require("./routes/staff/assessment/getAssessmentDetail");

// Project
const postProject = require("./routes/staff/project/postProject");
const getProject = require("./routes/staff/project/getProject");
const getProjectDetail = require("./routes/staff/project/getProjectDetail");
const delProject = require("./routes/staff/project/delProject");

// Classroom
const postClassroom = require("./routes/staff/classroom/postClassroom");
const getClassroom = require("./routes/staff/classroom/getClassroom");
const getClassroomDetail = require("./routes/staff/classroom/getClassroomDet");
const delClassroom = require("./routes/staff/classroom/delClassroom");
const updateClassroom = require("./routes/staff/classroom/updateClassroom");

// Auth token
const authToken = require("./middleware/authToken");

// Certificate
const getCertificate = require("./routes/admin/certificate/getCertificate");
const getCertId = require("./routes/admin/certificate/getCertId");
const updateCert = require("./routes/admin/certificate/updateCert");

// Message
const postMsg = require("./routes/cross/messages/postMsg");
const getMessageBtwSenders = require('./routes/cross/messages/getMessageBtwSenders');
const deleteMessageBtwSenders = require('./routes/cross/messages/deleteMessageBtwSenders');
const fetchAllConversations = require('./routes/cross/messages/fetchAllConversations');

// Verification
const verifyUserCode = require('./routes/cross/verifyOtp/verifyUserCode');
const sendVerificationCode = require('./routes/cross/verifyOtp/sendVerificationCode');

const logStaff = require("./routes/staff/account/logStaff");
const assignCohort = require("./routes/admin/cohort/assignCohort");

// Attendance
const postAttendance = require("./routes/staff/classroom/postAttendance");
const convertProgramArrayToObject = require("./routes/student/onboard/convertProgram");

// Non course route
const postNonCourse = require("./routes/admin/nonCourse/postNonCourse");
const getNonCourse = require("./routes/admin/nonCourse/getNonCourse");

// Grade posting
const postGradePro = require("./routes/staff/project/postGradePro");
const postSubmissionPro = require("./routes/staff/project/postSubmissionPro");
const postGradeAss = require("./routes/staff/assessment/postGradeAss");
const postSubmissionAss = require("./routes/staff/assessment/postSubmissionAss");

// Student profile
const postProfile = require('./routes/student/profile/postProfile');
const getProfile = require('./routes/student/profile/getProfile');
const getProfileDet = require('./routes/student/profile/getProfileDet');
const delProfile = require('./routes/student/profile/delProfile');

// Statuses
const updateProjectStatus = require("./routes/cross/status/projectStatus");
const updateCohortStatus = require("./routes/cross/status/cohortStatus");
const updateAssessmentStatus = require("./routes/cross/status/assessmentStatus");
const updateStudentWithoutOtherName = require("./routes/student/account/updateStudentOther");
const devPeekOtp = require('./routes/cross/verifyOtp/devPeekOtp');

// Blogs
const blogPostBatch = require('./routes/admin/blog/postBlogBatch');
const postBlog = require('./routes/admin/blog/postBlog.js');
const blogGet = require('./routes/admin/blog/getBlog');
const blogGetId = require('./routes/admin/blog/getBlogId');
const blogUpdate = require('./routes/admin/blog/updateBlog');
const blogDelete = require('./routes/admin/blog/delBlog');

// ✅ GridFS certificate routes
const { postCert, upload } = require("./routes/admin/certificate/postCert.gridfs");
const streamFile = require("./routes/cross/files/streamFile");
const delCert = require("./routes/admin/certificate/delCert.gridfs");
const authEcho = require('./routes/__dev/authEcho');

// Create Admin Account
const createAccount = require('./routes/admin/user/createAccount');
const logAdmin = require('./routes/admin/user/logAdmin');

// ---- Guests (admin)
const guestList = require('./routes/cross/guest/listGuests');
const guestCreate = require('./routes/cross/guest/createGuest');
const guestGet = require('./routes/cross/guest/getGuest');
const guestGetEmails = require('./routes/cross/guest/getGuestEmails');
const guestSendEmail = require('./routes/cross/guest/sendGuestEmail');
const syncGuestReplies = require('./routes/cross/guest/syncGuestReplies');

// ✅ Facebook Conversion API
const facebookRoutes = require("./routes/facebook.js");
const cookieParser = require("cookie-parser"); // why: module exports a function; calling it requires default import

/* ============================ App setup ============================ */
const app = express();

/* -------------------- CORS allowlist / helpers -------------------- */
const rawAllowed = [
  'http://localhost:3000',
  'https://lasop.net',
  'https://www.lasop.net',
  'https://lasop.vercel.app',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const normalize = (s) => String(s).trim().replace(/\/+$/, '').toLowerCase();
const allowedSet = new Set(rawAllowed.map(normalize));
const isAllowed = (origin) => origin && allowedSet.has(normalize(origin));
const pickACAO = (origin) => (isAllowed(origin) ? origin : "");

/* ------------- Ultra-early universal preflight (OPTIONS) ----------- */
app.use((req, res, next) => {
  if (req.method !== 'OPTIONS') return next();
  const origin = req.headers.origin || "";
  const acao = pickACAO(origin);
  res.setHeader('Vary', 'Origin');
  if (acao) res.setHeader('Access-Control-Allow-Origin', acao);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] || 'Content-Type, Authorization, X-Requested-With'
  );
  res.setHeader('Access-Control-Max-Age', '86400');
  return res.sendStatus(204);
});

if (process.env.EXPOSE_AUTH_DEBUG === '1') {
  app.get('/__dev/auth-echo', authEcho);
  app.delete('/__dev/auth-echo', authEcho);
}

/* ---------------------- Hardened CORS middleware ------------------- */
const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (isAllowed(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: (req, cb) => {
    cb(null, req.header('Access-Control-Request-Headers') || 'Content-Type, Authorization, X-Requested-With');
  },
  maxAge: 86400,
  optionsSuccessStatus: 204,
};

// Always vary on Origin to avoid proxy cache mixups
app.use((req, res, next) => { res.header('Vary', 'Origin'); next(); });

const corsMiddleware = cors(corsOptions);
app.use(corsMiddleware);
app.options('*', corsMiddleware);

/* -------------------------- Common middleware ---------------------- */
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser()); // why: must run before routes/middleware that read cookies

/* ------------------------ Static assets ---------------------------- */
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '7d', etag: true }));

const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  try { fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch {}
}

app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d', etag: true }));

/* ----------------------------- Health ------------------------------ */
app.get('/health', (_req, res) => res.status(200).send('ok'));
app.get('/ready', (_req, res) => {
  const dbReady = mongoose.connection.readyState === 1;
  if (dbReady) return res.status(200).send('ready');
  return res.status(503).json({ status: 'starting', dbState: mongoose.connection.readyState });
});
app.get('/', (_req, res) => res.status(200).json({ service: 'lasopnext-server', status: 'ok' }));

/* ============================ Main Routes ============================ */

// ✅ Facebook Conversion API
app.use("/facebook", facebookRoutes);

/* ============= Admin / Accountant / Super admin ============= */
app.post('/user', signUser);
app.post('/logUser', logUser);
app.put('/updateUser/:id', updateUser);
app.delete('/deleteUser/:id', delUser);

/* ============================ Student ============================ */
app.post('/signStudent', upload.single('profile'), signStudent);
app.post('/convertProgram', convertProgramArrayToObject);
app.post('/logStudent', logStudent);
app.put('/updateStudent/:id', updateStudent);
app.put('/addCourse/:id', authToken, addCourseStudent);
app.delete('/deleteStudent/:id', delStudent);
app.get('/studentDetails/:id', getStudentDet);
app.get('/getStudent', getStudent);
app.get('/studentStatus/:status/:cohortId/:courseId', fetchStudentByStatus)

/* ============================== Blog ============================== */
app.post('/blog/batch', blogPostBatch);
app.post('/blog/:userId', postBlog);
app.get('/blog', blogGet);
app.get('/blog/:id', blogGetId);
app.put('/blog/:id', blogUpdate);
app.delete('/blog/:blogId/:userId', blogDelete);

/* =========================== Assessment ========================== */
app.post('/postAssessment', postAssessment);
app.get('/getAssessment', getAssessment);
app.get('/getAssessmentDet/:id', getAssessmentDetail);
app.put('/gradeStudent/:assessmentId/grade/:studentId', postGradeAss);
app.post('/submitAssessment/:assessmentId', postSubmissionAss);
app.delete('/delAssessment/:id', authToken, delAssessment);

/* ============================ Classroom ========================= */
app.post('/postClassroom', postClassroom);
app.get('/getClassroom', getClassroom);
app.get('/getClassroomDet/:id', getClassroomDetail);
app.delete('/delClassroom/id', delClassroom);
app.put('/updateClassroom/:id', updateClassroom);
app.put('/postAttendance/:id', postAttendance);

/* ============================= Cohort ========================== */
app.post('/postCohort', postCohort);
app.get('/getCohort', getCohort);
app.get('/getCohortDetail/:id', getCohortDetails);
app.put('/updateCohort/:id', updateCohort);
app.put('/assignCohort/:id', assignCohort);
app.delete('/deleteCohort/:id', delCohort);
app.post('/postCohortExam', authToken, postCohortExam);
app.get('/getCohortExam', authToken, getCohortExam);
app.get('/getCohortExamDet/:id', authToken, getCohortExamDet);
app.get('/getCohortByCourse/:courseId', fetchCohortsByCourse);

/* ============================== Course ========================= */
app.post('/postCourse', postCourse);
app.get('/getCourse', getCourse);
app.get('/getCourseDetail/:id', getCourseDetails);
app.put('/updateCourse/:id', authToken, updateCourse);
app.delete('/deleteCourse/:id', authToken, delCourse);

/* ============================== Center ========================= */
app.post('/postCenter', authToken, postCenter);
app.get('/getCenter', getCenter);

/* =========================== Certificate ======================= */
app.post('/postCertificate', upload.single('certificate'), postCert);
app.get('/getCertificate', getCertificate);

const requireAuth = process.env.REQUIRE_AUTH !== '0';
if (requireAuth) {
  app.get('/getCertificateId/:id', authToken, getCertId);
  app.put('/updateCertificate/:id', authToken, updateCert);
  app.delete('/deleteCertificate/:id', authToken, delCert);
} else {
  app.get('/getCertificateId/:id', getCertId);
  app.put('/updateCertificate/:id', updateCert);
  app.delete('/deleteCertificate/:id', delCert);
}

app.get('/files/:id', streamFile);

/* ================================ Exam ========================== */
app.post('/postExam', authToken, postExam);
app.get('/getExam', authToken, getExam);
app.put('/updateExam/:id', authToken, updateExam);
app.delete('/deleteExam/:id', authToken, delExam);

/* ================================ Job ========================== */
app.post('/postJob', postJob);
app.get('/getJob', getJob);
app.put('/updateJob/:id', authToken, updateJob);
app.delete('/deleteJob/:id', authToken, delJob);

/* ============================== Message ======================== */
app.post('/postMsg', postMsg);
app.get('/getMsgBtwSenders/:senderId/:receiverId/:senderModel/:receiverModel', getMessageBtwSenders);
app.delete('/delMsgBtwSenders/:messageId/:otherUserId', deleteMessageBtwSenders);
app.get('/fetchAllConversations', fetchAllConversations);

/* ============================== Cohort Message ======================== */
app.post('/sendCohortMsg', postCohortMessage);
app.get('/getCohortMessage/:cohortId', getCohortMessages);
app.delete('/deleteCohortMessage', deleteCohortMessage);

/* ============================== Group Message ======================== */
app.post('/sendGroupMessage', postGroupMessage);
app.get('/getGroupMessage/:groupId', getGroupMessages);
app.delete('/deleteGroupMessage/messageId/:groupId', deleteGroupMessage);

/* ========================== Non-course staff =================== */
app.post('/postNonCourse', postNonCourse);
app.get('/getNonCourse', getNonCourse);

/* ============================== Project ======================== */
app.post('/postProject', postProject);
app.get('/getProject', getProject);
app.get('/getProjectDet/:id', getProjectDetail);
app.delete('/delProject/:id', authToken, delProject);
app.put('/gradeProject/:projectId/grade/:studentId', postGradePro);
app.post('/submitProject/:projectId', postSubmissionPro);

/* ============================== Profile ======================== */
app.post('/postProfile', upload.single('proPic'), postProfile);
app.get('/getProfile', getProfile);
app.get('/getProfileDet/:id', getProfileDet);
app.delete('/delProfile/:id', delProfile);

/* =============================== Result ======================== */
app.post('/postResult', authToken, postResult);
app.get('/getResult', authToken, getResult);
app.get('/getResultDetail/:id', authToken, getResultDetail);

/* ============================== Syllabus ======================= */
app.post('/postSyllabus', upload.single('sylFile'), postSyllabus);
app.get('/getSyllabus', getSyllabus);
app.put('/updateSyllabus/:id', authToken, updateSyllabus);
app.delete('/deleteSyllabus/:id', authToken, delSyllabus);

/* =============================== Staff ========================= */
app.post('/postStaff', postStaff);
app.post('/logStaff', logStaff);
app.get('/getStaff', getStaff);
app.get('/getStaffDet/:id', getStaffId);
app.put('/updateStaff/:id', updateStaffDet);
app.get('/staffByRole/:role', fetchStaffByRole)

app.post('/postOtherInfo', authToken, postOtherInfo);
app.get('/getOtherInfo', authToken, getOtherInfo);
app.get('/getOtherInfoDet/:id', authToken, getOtherInfoDet);
app.put('/updateOtherInfo/:id', authToken, updateOtherInfo);

/* =============================== Status ======================== */
app.put('/cohortStatus', updateCohortStatus);
app.put('/projectStatus', updateProjectStatus);
app.put('/assessmentStatus', updateAssessmentStatus);

/* ============================ Verify Email ===================== */
app.post('/sendOtp', sendVerificationCode);
app.post('/verifyOtp', verifyUserCode);
app.get('/__dev/otp', devPeekOtp);

/* ================================ Chat ========================= */
// app.post('/postChat', authToken, postMsg);
// app.get('/getChat', authToken, getMsg);

/* ===== update student without other name ===== */
app.put('/addOtherName', updateStudentWithoutOtherName);
/* ================================ Admin ========================= */
app.post('/createAccount', createAccount);
app.post('/logAdmin', logAdmin);


/* ============================== Guests ============================== */
const guestGuard = requireAuth ? authToken : (_req, _res, next) => next();
app.get('/admin/guests', guestGuard, guestList);
app.post('/admin/guests', guestGuard, guestCreate);
app.get('/admin/guests/:id', guestGuard, guestGet);
app.get('/admin/guests/:id/emails', guestGuard, guestGetEmails);
app.post('/admin/guests/:id/emails', guestGuard, guestSendEmail);
app.post('/admin/guests/:id/replies/sync', guestGuard, syncGuestReplies);

app.get('/favicon.ico', (_req, res) => res.status(204).end());

/* -------------- CORS-specific error surface (optional) -------------- */
app.use((err, req, res, next) => {
  if (err && /Not allowed by CORS/i.test(err.message)) {
    const origin = req.headers.origin || "";
    const acao = pickACAO(origin);
    if (acao) res.setHeader('Access-Control-Allow-Origin', acao);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
    return res.status(403).json({ error: 'CORS', origin: origin || null });
  }
  return next(err);
});

/* ✅ Start server */
const PORT = Number(process.env.PORT) || 3000;
connection({ app, port: PORT });
