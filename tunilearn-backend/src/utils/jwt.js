const jwt = require('jsonwebtoken');

exports.signJwt = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};