const Staff = require('../../models/staff');

const updateStaffDet = async (req, res) => {
    const { id } = req.params;
    const { ...otherField } = req.body;

    try {
        const updateStaff = await Staff.findByIdAndUpdate(
            id,
            { ...otherField },
            { new: true, runValidators: true }
        );

        if(!updateStaff) {
            return res.status(404).json({
                message: 'Account not found'
            })
        } else {
            res.status(200).json({
                message: 'Account updated successfully',
                data: updateStaff
            })
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = updateStaffDet;