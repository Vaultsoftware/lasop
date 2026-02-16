const Staff = require('../../../models/staff/staff');

const fetchStaffByRole = async (req, res) => {
    try {
        const { role } = req.params;

        if (!role) {
            return res.status(400).json({
                success: false,
                message: 'role is required',
            });
        }

        const staff = await Staff.find({ role })
            .lean();

        return res.status(200).json({
            message: "Staff fetched successfully",
            data: staff,
        });

    } catch (err) {
        console.error('fetchStaffByRole error:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch staff',
        });
    }
};

module.exports = fetchStaffByRole;
