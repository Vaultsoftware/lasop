const Project = require('../../../models/student/projects');
const Cohort = require('../../../models/admin/cohort');
const { getSocket } = require('../../../config/connection');

const postProject = async (req, res) => {
    const { title, duration, start, overview, objectives, deliverables, submission = [], dueDate, cohortId, courseId, center, mode, tutorId } = req.body;

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

        const projectExist = await Project.findOne({ title })
        if (projectExist) {
            return res.status(400).json({ message: 'Project title already exists' })
        }

        const projectData = await Project.create({
            title,
            duration,
            start,
            overview,
            objectives,
            deliverables,
            submission,
            dueDate,
            cohortId,
            courseId,
            center,
            mode,
            tutorId
        })

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('newProject', projectData);
            io.emit('newProject', projectData);
        }

        return res.status(201).json({ message: 'Project created successfully', data: projectData })
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = postProject;