const Assessment = require("../../../models/staff/assessments");
const Staff = require("../../../models/staff/staff");

const fetchAllAssessmentsByTutor = async (req, res) => {
    const { staffId } = req.params;

    if (!staffId) {
        return res.status(400).json({
            message: "staffId is required",
        });
    }

    try {
        const tutor = await Staff.findById(staffId);
        if (!tutor) {
            return res.status(404).json({
                message: "Tutor not found",
            });
        }

        const assessments = await Assessment.find({
            tutorId: staffId,
        })
            .populate("cohortId", "cohortName status startDate endDate")
            .populate("courseId", "name title code")
            .populate("center", "name location")
            .populate("tutorId", "firstName lastName email");

        if (!assessments || assessments.length === 0) {
            return res.status(404).json({
                message: "No assessments found for this tutor",
            });
        }

        const groupedByCohort = {};

        assessments.forEach((assessment) => {
            const cohortKey = assessment.cohortId?._id?.toString() || "unassigned";

            if (!groupedByCohort[cohortKey]) {
                groupedByCohort[cohortKey] = {
                    cohort: assessment.cohortId || null,
                    assessments: [],
                };
            }

            groupedByCohort[cohortKey].assessments.push({
                _id: assessment._id,
                title: assessment.title,
                instruction: assessment.instruction,
                dueDate: assessment.dueDate,
                course: assessment.courseId,
                center: assessment.center,
                mode: assessment.mode,
                status: assessment.status,
                createdAt: assessment.createdAt,
                submissionCount: assessment.submission?.length || 0,
            });
        });

        return res.status(200).json({
            message: "Tutor assessments fetched successfully",
            cohorts: groupedByCohort,
        });
    } catch (error) {
        console.error("Error fetching tutor assessments:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = fetchAllAssessmentsByTutor;
