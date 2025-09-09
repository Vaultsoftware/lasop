const Classroom = require("../../models/classroom");
const Cohort = require('../../models/cohort');

const postClassroom = async (req, res) => {
    const { title, cohortId, courseId, center, tutorId, mode, date, time, zoomLink, startClass, attendance, duration, status } = req.body;

    try {
        const cohort = await Cohort.findById(cohortId).populate('courseTutors.course');

        if (!cohort) {
            return res.status(404).json({ message: 'Cohort not found or it has ended' });
        }

        const courseTutorAssignment = cohort.courseTutors.find(ct => {
            return ct.course._id.equals(courseId) && ct.tutors.equals(tutorId);
        });
    
        if (!courseTutorAssignment) {
            return res.status(403).json({ message: 'Tutor not assigned to this course in the cohort' });
        }
    

        const classExist = await Classroom.findOne({ title });

        if(classExist) {
            return res.status(200).json({
                message: 'Classroom already exists'
            })
        }

        const classData = await Classroom.create({
            title, cohortId, courseId, center, tutorId, mode, date, time, zoomLink, startClass, attendance, duration, status
        })
        return res.status(201).json({message: 'Classroom created successfully', data: classData})
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = postClassroom;