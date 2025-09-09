const Cohort = require('../../models/cohort');
const Student = require('../../models/student');

const assignCohort = async (req, res) => {
    const { id } = req.params;
    const courseTutorData = req.body;

    try {
        // Check if the tutor has already been assigned to the same course, center, and mode
        const cohort = await Cohort.findOne({
            _id: id,
            courseTutors: {
                $elemMatch: {
                    courseId: courseTutorData.courseId,
                    center: courseTutorData.center,
                    mode: courseTutorData.mode
                }
            }
        });

        // If a matching course, center, and mode is found, prevent duplicate assignment
        if (cohort) {
            return res.status(400).json({
                message: 'Tutor has already been assigned to this course, center, and mode'
            });
        }

        // If no match is found, proceed with the assignment
        const updatedCohort = await Cohort.findByIdAndUpdate(
            id,
            { $push: { courseTutors: courseTutorData } },
            { new: true, runValidators: true }
        );

        if (!updatedCohort) {
            return res.status(404).json({
                message: 'Cohort not found'
            });
        }

        // Update students who match the criteria and have no tutor assigned
        const matchingStudents = await Student.find({
            "program.courseId": courseTutorData.courseId,
            "program.center": courseTutorData.center,
            "program.mode": courseTutorData.mode,
            "program.cohortId": id,
            "program.tutorId": { $exists: false }
        });

        for (let student of matchingStudents) {
            await Student.findByIdAndUpdate(student._id, {
                $set: { "program.tutorId": courseTutorData.tutorId }
            });
        }

        res.status(200).json({
            message: 'Cohort updated successfully',
            data: updatedCohort
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = assignCohort;