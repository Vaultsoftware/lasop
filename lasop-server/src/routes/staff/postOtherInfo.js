const OtherInfo = require('../../models/otherInfo');

const postOtherInfo = async (req, res) => {
    const { staffId, kin, guarantor1, guarantor2 } = req.body;

    try {
        const existingInfo = await OtherInfo.findOne({ staffId });

        if (existingInfo) {
            return res.status(400).json({ message: 'OtherInfo already exists for this staff member' });
        }

        const newInfo = await OtherInfo.create({
            staffId, kin, guarantor1, guarantor2
        })

        res.status(201).json({message: 'Info uploaded successfully', data: newInfo});
        
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = postOtherInfo;