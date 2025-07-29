const jwt = require('jsonwebtoken');

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided.' });

  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.status(401).json({ message: 'No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') return next();
  return res.status(403).json({ message: 'Admin access only.' });
};

exports.isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'TEACHER') return next();
  return res.status(403).json({ message: 'Teacher access only.' });
};

exports.isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'STUDENT') return next();
  return res.status(403).json({ message: 'Student access only.' });
};