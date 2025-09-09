const Report = require("../../models/report");

const postReport = async (req, res) => {
    const { staffId, date, completedTask, notes } = req.body;

    try {
        const reportForTheDayExist = await Report.findOne({ staffId, date });

        if (reportForTheDayExist) {
            return res.status(400).json({
                message: "You've posted a report today already"
            });
        } else {
            const newReport = await Report.create({
                staffId,
                date,
                completedTask,
                notes,
            });
    
            return res.status(201).json({message: 'Report created successfully', data: newReport})
        }
    } catch (error) {
        res.status(400).json({ error: error.message, });
    };
};

module.exports = postReport;