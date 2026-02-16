const { getSocket } = require('../../../config/connection');
const Assessment = require('../../../models/staff/assessments');
const Cohort = require('../../../models/admin/cohort');

const postAssessment = async (req, res) => {
    const { title, submission = [], instruction, dueDate, cohortId, courseId, center, mode,  tutorId } = req.body;

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

        const assessmentExist = await Assessment.findOne({ title, cohortId, courseId })
        if(assessmentExist) {
            return res.status(400).json({message: 'Assessment title already exists for this cohort and course'})
        }

        const AssessmentData = await Assessment.create({
            title, 
            submission,
            instruction,
            dueDate, 
            cohortId,
            courseId,
            center,
            mode,
            tutorId
        })

        const io = getSocket();
        if(io) {
            io.to('lasop_global_room').emit('postAssessment', AssessmentData)
        }
        
        return res.status(201).json({message: 'Assessment created successfully', data: AssessmentData})
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = postAssessment;