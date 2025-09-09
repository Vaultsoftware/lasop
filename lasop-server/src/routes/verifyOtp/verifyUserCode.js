const VerifyOtp = require('../../models/verification');

const verifyUserCode = async (req, res) => {
    const { email, code } = req.body;

    try {
        // Find the email entry in the database
        const emailEntry = await VerifyOtp.findOne({ email });

        if (!emailEntry) {
            return res.status(404).json({ message: 'No verification code found for this email.' });
        }

        // Check if the provided code matches
        if (emailEntry.code !== code) {
            return res.status(400).json({ message: 'Invalid verification code.' });
        }

        // Check if the code has expired
        if (Date.now() > emailEntry.codeExpiration) {
            return res.status(400).json({ message: 'Verification code has expired.' });
        }

        // If the code is correct and not expired, mark the email as verified
        await VerifyOtp.findOneAndDelete({ email }); 

        return res.status(200).json({ message: 'Email verified successfully.' });

    } catch (error) {
        return res.status(500).json({ message: 'An error occurred during verification.', error: error.message });
    }
};

module.exports = verifyUserCode;
