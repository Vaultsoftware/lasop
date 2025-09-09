const Staff = require('../../models/staff');

const getStaffId = async (req, res) => {
    const { id } = req.params;

    try {
        const staffDetails = await  Staff.findById(id).populate('otherInfo');

        if(!staffDetails) {
            return res.status(404).json({
                message: 'Staff not found'
            });
        } else {
            res.status(200).json(staffDetails);
        };
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getStaffId;