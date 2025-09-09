const OtherInfo = require('../../models/otherInfo');

const getOtherInfo = async (req, res) => {
    try {
        const otherInfos = await OtherInfo.find().populate('staffId');

        if (!otherInfos || otherInfos.length === 0) {
            return res.status(404).json({ message: 'No info found' });
        }

        res.status(201).json(otherInfos)
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = getOtherInfo;