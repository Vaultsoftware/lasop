const Result = require('../../models/result');

const postResult = async (req, res) => {
    const { studentId, cohortId, courseId, centerId, examTaken } = req.body;

    try {
        const results = await Result.create({
            studentId, cohortId, courseId, centerId, examTaken
        })

        res.status(201).json({
            message: 'Result uploaded successfully',
            data: results
        })
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = postResult;