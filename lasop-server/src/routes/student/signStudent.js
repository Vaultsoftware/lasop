const Student = require('../../models/student');
const Cohort = require('../../models/cohort');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const express = require('express');
const multer = require('multer');
const { storage } = require('../../config/firebaseConfig');
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

const getEmailTemplate = (firstName, course) => {
    let emailContent = '';

    switch (course) {
        case 'Fullstack Development':
            emailContent = `Hi ${firstName}!\n\nWe are glad that you have enrolled to be a student at our school. \n\n

            Congratulations! \n\n

            We welcome you to the Lagos School of Programming (LASOP), Lagos-Nigeria.\n\n

            At LASOP, we provide high-quality training to equip our students with  industry – recognized IT skills and the kind of knowledge that high achieving companies are looking for. Just as with any position, having people interested in the job is not enough for them to get hired. There may be existing programmers on the market, but their inexperience may make employers go for someone older in the game. \n\n

            Therefore, it's not just the question of having a talent pool but also of talent level. Lack of practical experience and the lack of workplace experience are some of the problems faced by most first-time hires today.\n\n

            To make sure you come out well polished, we have in long-term employment; industry experts waiting to be your tutors. This is to ensure that you do not struggle to understand your studies from  the first day.\n\n

            LASOP MENTORS! 
            We don't just train. We follow up with your development and growth in the tech space by entertaining and providing answers to your questions and counselling you from time to time. As an alumni, you are always welcome to the school, and you can utilise any of our "free to use" facilities when you want to. You can know more about us by visiting https://www.lasop.net/about or by visiting our campus.\n\n

            You will be taught on frontend and backend courses in a very organized manner and you will do really good at programming. More information on your courses can be found at: https://lasop.net/course/Fullstack\n\n

            If you need to get in touch with anyone in the office, please use this link to view our contact address: https://www.lasop.net/contact\n\n

            Please dive into the student suite and explore the opportunities prepared for you! To log in with the email and password you used during registration, visit https://lasop.net/dashboard\n\n

            Congratulations once again, and I'm looking forward to hearing about your progress and success after your engagement with LASOP! \n\n



            Faith Igboin,\n
            Admission office,\n
            Lagos School of Programming Limited\n
            Ojodu-Berger, Lagos.\n
            +2347025713326 `;
            break;
        case 'Frontend':
            emailContent = `Hi ${firstName}!\n\nWe are glad that you have enrolled to be a student at our school.\n\n

Congratulations!\n\n

We welcome you to the Lagos School of Programming (LASOP), Lagos-Nigeria.\n\n

At LASOP, we provide high-quality training to equip our students with industry – recognized IT skills and the kind of knowledge that high achieving companies are looking for. Just as with any position, having people interested in the job is not enough for them to get hired. There may be existing programmers on the market, but their inexperience may make employers go for someone older in the game. \n\n

Therefore, it's not just the question of having a talent pool but also of talent level. Lack of practical experience and the lack of workplace experience are some of the problems faced by most first-time hires today.\n\n

To make sure you come out well polished, we have in long-term employment; industry experts waiting to be your tutors. This is to ensure that you do not struggle to understand your studies from the first day.\n\n

LASOP MENTORS! \n
We don't just train. We follow up with your development and growth in the tech space by entertaining and providing answers to your questions and counselling you from time to time. As an alumni, you are always welcome to the school, and you can utilise any of our "free to use" facilities when you want to. You can know more about us by visiting https://www.lasop.net/about or by visiting our campus.\n\n

You will be taught frontend in a very organized manner and you will do really good at programming. More information on your courses can be found at: https://lasop.net/course/Frontend\n\n

If you need to get in touch with anyone in the office, please use this
link to view our contact address: https://www.lasop.net/contact.html.\n\n

Please dive into the student suite and explore the opportunities prepared for you! To log in with the email and password you used during registration, visit https://lasop.net/dashboard\n\n

Congratulations once again, and I'm looking forward to hearing about your progress and success after your engagement with LASOP! \n\n



Faith Igboin,\n
Admission office,\n
Lagos School of Programming Limited\n
Ojodu-Berger, Lagos.\n
+2347025713326 `;
            break;
        case 'Data Science And AI':
            emailContent = `Hi ${firstName}!\n\nWe are glad that you have enrolled to be a student at our school.\n\n

Congratulations!\n\n

We welcome you to the Lagos School of Programming (LASOP), Lagos-Nigeria.\n\n

At LASOP, we provide high-quality training to equip our students with industry – recognized IT skills and the kind of knowledge that high achieving companies are looking for. Just as with any position, having
people interested in the job is not enough for them to get hired. There may be existing programmers on the market, but their inexperience may make employers go for someone older in the game. \n\n

Therefore, it's not just the question of having a talent pool but also of talent level. Lack of practical experience and the lack of workplace experience are some of the problems faced by most first-time hires today.\n\n

To make sure you come out well polished, we have in long-term employment; industry experts waiting to be your tutors. This is to ensure that you do not struggle to understand your studies from the first day.\n\n

LASOP MENTORS! \n
We don't just train. We follow up with your development and growth in the tech space by entertaining and providing answers to your questions and counselling you from time to time. As an alumni, you are always welcome to the school, and you can utilise any of our "free to use" facilities when you want to. You can know more about us by visiting
https://www.lasop.net/about or by visiting our campus.\n\n

You will be taught data science in a very organized manner, and you will do really well at analysis and artificial intelligence. More information on your courses can be found at: https://lasop.net/course/Data%20Science%20And%20AI\n\n

If you need to get in touch with anyone in the office, please use this link to view our contact address: https://www.lasop.net/contact \n\n

Please dive into the student suite and explore the opportunities prepared for you! To log in with the email and password you used during registration, visit https://lasop.net/dashboard\n\n

Congratulations once again, and I'm looking forward to hearing about your progress and success after your engagement with LASOP! \n\n



Faith Igboin,\n
Admission office,\n
Lagos School of Programming Limited\n
Ojodu-Berger, Lagos.\n
+2347025713326 `;
            break;
        case 'Data Analytics':
            emailContent = `Hi ${firstName}!\n\nWe are glad that you have enrolled to be a student at our school \n\n.

Congratulations!\n\n

We welcome you to the Lagos School of Programming (LASOP), Lagos-Nigeria.\n\n

At LASOP, we provide high-quality training to equip our students with industry – recognized IT skills and the kind of knowledge that high achieving companies are looking for. Just as with any position, having
people interested in the job is not enough for them to get hired. There may be existing programmers on the market, but their inexperience may make employers go for someone older in the game. \n\n

Therefore, it's not just the question of having a talent pool but also of talent level. Lack of practical experience and the lack of workplace experience are some of the problems faced by most first-time hires today.\n\n

To make sure you come out well polished, we have in long-term employment; industry experts waiting to be your tutors. This is to ensure that you do not struggle to understand your studies from the first day.\n\n

LASOP MENTORS! \n
We don't just train. We follow up with your development and growth in the tech space by entertaining and providing answers to your questions and counselling you from time to time. As an alumni, you are always welcome to the school, and you can utilise any of our "free to use" facilities when you want to. You can know more about us by visiting https://www.lasop.net/about or by visiting our campus.\n\n

You will be taught data analysis in a very organized manner, and you will do really well at it in a matter of months. More information on your courses can be found at: https://lasop.net/course/Data%20Analytics\n\n

If you need to get in touch with anyone in the office, please use this link to view our contact address: https://www.lasop.net/contact\n\n

Please dive into the student suite and explore the opportunities prepared for you! To log in with the email and password you used during registration, visit https://lasop.net/dashboard\n\n

Congratulations once again, and I'm looking forward to hearing about your progress and success after your engagement with LASOP! \n\n



Faith Igboin,\n
Admission office,\n
Lagos School of Programming Limited\n
Ojodu-Berger, Lagos.\n
+2347025713326 `;
            break;
        default:
            emailContent = `Hi ${firstName}!\n\nWelcome to the Lagos School of Programming! We're glad to have you...`;
    }

    return emailContent;
};


const signStudent = async (req, res) => {
    const { firstName, lastName, email, password, contact, address, program, allowed, gender, status } = req.body;
    const profile = req.file

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(password, salt);

        let fileUrl = null;

        const emailExist = await Student.findOne({ email })
        if (emailExist) {
            return res.status(400).json({ message: 'Email already exists' })
        }
        else {
            if (profile) {
                const bucket = storage.bucket();
                const file = bucket.file(`certificates/${encodeURIComponent(profile.originalname)}`);

                const stream = file.createWriteStream({
                    metadata: {
                        contentType: profile.mimetype,
                    },
                });

                // Handle errors during the upload
                stream.on('error', (err) => {
                    return res.status(500).json({ error: 'Failed to upload file', details: err.message });
                });

                // Uploading the file
                stream.on('finish', async () => {
                    fileUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
                });

                stream.end(profile.buffer);
            }

            const cohort = await Cohort.findById(program.cohortId)
                .populate({
                    path: 'courseTutors',
                    match: {
                        course: program.courseId,
                        center: program.center,
                        mode: program.mode,
                    },
                    select: 'tutors',
                });

            // Check if a tutor is available or set a placeholder
            if (cohort && cohort.courseTutors.length > 0) {
                program.tutorId = cohort.courseTutors[0].tutors;
            } else {
                program.tutorId = "pending";
            }

            // Create the syllabus document with the correct URL
            const newStudent = new Student({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashPwd,
                contact: contact,
                address: address,
                program: program,
                profile: fileUrl || '',
                gender: gender,
                allowed: allowed,
                status: status
            })

            // Save new student to the database
            const saveStudent = await newStudent.save();

            const populatedStudent = await saveStudent.populate({
                path: 'program.courseId',
                model: 'Course',
                select: 'title'
            });

            const courseTitle = populatedStudent.program.courseId.title;

            const emailContent = getEmailTemplate(firstName, courseTitle);

            const mailOptions = {
                from: process.env.EMAIL_RECIEVE,
                to: email,
                subject: `New message from LASOP`,
                text: emailContent
            };

            // Send welcome email to the student after account creation
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error occurred while sending email:', error);
                    return res.status(500).json({ message: 'Account created, but email could not be sent.' });
                }
            });

            // Return success response
            res.status(201).json({
                message: 'Account created successfully and confirmation email sent!',
                data: saveStudent,
            });
        }


    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = signStudent;