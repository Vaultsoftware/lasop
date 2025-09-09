const Job = require('../../models/job');

const postJob = async (req, res) => {
    const { jobTitle, salary, jobType, requirements, company, location, city, jobDescription } = req.body;

    try {
        const newJob = new Job({
            jobTitle: jobTitle,
            salary: salary,
            jobType: jobType,
            requirements: requirements,
            company: company,
            location: location,
            city: city,
            jobDescription: jobDescription
        });

        const saveJob = await newJob.save();
        res.status(201).json({
            message: 'Job post uploaded',
            data: saveJob
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    };
};

module.exports = postJob;