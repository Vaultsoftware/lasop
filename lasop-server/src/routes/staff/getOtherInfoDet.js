const OtherInfo = require('../../models/otherInfo');

const getOtherInfoDet = async (req, res) => {
    try {
        const { id } = req.params;

        const otherInfoDet = await OtherInfo.findById(id).populate('staffId');

        if(!otherInfoDet) {
            return res.status(404).json({
                message: 'Info not found'
            });
        } else {
            res.status(200).json(otherInfoDet);
        };
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getOtherInfoDet;