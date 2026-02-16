const { getSocket } = require('../../../config/connection');
const Profile = require('../../../models/student/profile');

const delProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const proId = await Profile.findByIdAndDelete(id);

        if (!proId) {
            return res.status(404).json({
                message: 'No profile found'
            })
        }

        const io = getSocket();
        if (io) {
            io.to('lasop_global_room').emit('deleteProfile', proId);
            io.to(proId._id.toString()).emit('deleteProfile', proId);
        };

        res.status(200).json({
            message: 'Profile deleted successfully',
            data: proId
        });
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = delProfile;