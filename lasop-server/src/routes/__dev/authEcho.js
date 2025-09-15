module.exports = (req, res) => {
  res.status(200).json({
    path: req.path,
    method: req.method,
    origin: req.headers.origin || null,
    authorization: req.headers.authorization || null,
  });
};
