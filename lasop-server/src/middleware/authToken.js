require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  if (!token) {
    res.set('WWW-Authenticate', 'Bearer realm="api"');
    return res.status(401).json({ error: 'missing_token' });
  }

  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    res.set('WWW-Authenticate', 'Bearer error="invalid_token"');
    return res.status(401).json({ error: 'invalid_token', detail: err?.message });
  }
};
