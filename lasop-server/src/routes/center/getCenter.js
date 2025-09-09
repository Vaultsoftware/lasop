const Center = require('../../models/center');

const getCenter = async (req, res) => {
    try {
        const center = await Center.find();

        if (!center || center.length === 0) {
            return res.status(404).json({ message: 'No centers found' });
        }

        res.status(201).json(center)
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = getCenter;