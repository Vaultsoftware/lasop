const Profile = require('../../models/profile');

const getProfileDet = async (req, res) => {
    const { id } = req.params;

    try {
        const proId = await Profile.findById(id).populate('studentId');

        if(!proId) {
            return res.status(404).json({
                message: 'No profile found'
            })
        }

        res.status(200).json(proId);
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
}

module.exports = getProfileDet;