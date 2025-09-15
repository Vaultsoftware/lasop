require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (userDoc) => {
  // minimal payload; you can add role if needed: { sub: userDoc._id, role: userDoc.role }
  return jwt.sign({ sub: userDoc._id }, process.env.TOKEN_SECRET /*, { expiresIn: '7d' }*/);
};

module.exports = generateToken;
