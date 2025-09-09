const User = require('../../models/user');

const delUser = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await User.findByIdAndDelete(adminId);

        if (!adminId) {
            return res.status(404).json({
                message: 'Account not found'
            });
        };
        res.status(200).json({ message: 'Account deleted successfully', admin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
};

module.exports = delUser;