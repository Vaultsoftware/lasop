const Result = require('../../models/result');

const getResultDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const resultId = await Result.findById(id).populate('studentId').populate('cohortId').populate('courseId').populate('centerId');

        if(!resultId) {
            return res.status(400).json({
                message: 'No result found for this user'
            })
        } else {
            res.status(200).json(resultId);
        }
    } catch (error) {
        res.status(400).json({ error: error.message, });
    }
};

module.exports = getResultDetail;