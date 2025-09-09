require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (para) => {
    return jwt.sign({para: para._id}, process.env.TOKEN_SECRET);
};

module.exports = generateToken;
