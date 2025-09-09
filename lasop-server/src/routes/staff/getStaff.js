const Staff = require('../../models/staff');

const getStaff = async (req, res) => {
    try {
        const staffs = await Staff.find().populate('otherInfo');

        if(!staffs || staffs.length === 0) {
            return res.status(404).json({
                message: 'No staff found'
            });
        }
        res.status(201).json(staffs);
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getStaff;