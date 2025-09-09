const Center = require('../../models/center');

const postCenter = async (req, res) => {
    const { title } = req.body;

    try {
        const centerExist = await Center.findOne({ title });

        if(centerExist) {
            return res.status(400).json({
                message: "Center already exist"
            });
        }
        else {
            const newCenter = await Center.create({
                title
            });

            res.status(201).json({
                message: 'Center created successfully',
                data: newCenter
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = postCenter