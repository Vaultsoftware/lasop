const { getSocket } = require('../../../config/connection');
const OtherInfo = require('../../../models/staff/otherInfo');

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

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('newOtherInfo', newInfo);
        }

        res.status(201).json({message: 'Info uploaded successfully', data: newInfo});
        
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = postOtherInfo;