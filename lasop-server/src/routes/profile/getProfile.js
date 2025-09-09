const Profile = require("../../models/profile");

const getProfile = async (req, res) => {
    try {
        const profilePicData = await Profile.find().populate('studentId');

        res.status(200).json(profilePicData);
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getProfile