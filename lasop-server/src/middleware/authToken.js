require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const auth = req.headers['authorization'] || req.headers['Authorization'];
    const token = auth && auth.startsWith('Bearer ') ? auth.slice(7).trim() : null;

    if (!token) {
      res.set('WWW-Authenticate', 'Bearer realm="api"');
      return res.status(401).json({ error: 'missing_token' });
    }

    const payload = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    res.set('WWW-Authenticate', 'Bearer error="invalid_token"');
    return res.status(401).json({ error: 'invalid_token', detail: err?.message });
  }
};
