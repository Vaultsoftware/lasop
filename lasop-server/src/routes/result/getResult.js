const Result = require('../../models/result');

const getResult = async (req, res) => {
    try {
        const results = await Result.find().populate('studentId').populate('cohortId').populate('courseId').populate('centerId');

        if(!results || results.length === 0) {
            return res.status(400).json({
                message: 'No results found'
            })
        } else {
            res.status(200).json(results);
        }
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getResult;