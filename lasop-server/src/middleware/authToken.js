require('dotenv').config();
const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified

        next();
    } catch (err) {
        res.status(400).json({ error: err.message });
    };
};

module.exports = authToken;