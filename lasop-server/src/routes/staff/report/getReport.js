const Report = require("../../models/report");

const getReport = async (req, res) => {
    try {
        const report = await Report.find().populate('staffId');

        res.status(200).json(report);
    } catch (error) {
        res.status(400).json({ error: error.message, });
    }
}

module.exports = getReport;