const { getSocket } = require('../../../config/connection');
const User = require('../../../models/cross/user');

const delUser = async (req, res) => {
    try {
        const adminId = req.params.id;
        if (!adminId) {
            return res.status(400).json({
                message: 'Admin id is required'
            })
        }

        const admin = await User.findByIdAndDelete(adminId);

        if (!admin) {
            return res.status(404).json({
                message: 'Account not found'
            });
        };

        const io = getSocket();
        if (io) {
            io.to(adminId).emit('accountDeleted', { message: 'Your account has been deleted by.', data: admin });
        }

        return res.status(200).json({ message: 'Account deleted successfully', admin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    };
};

module.exports = delUser;