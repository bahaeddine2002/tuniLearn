const { verifyJwt } = require('../utils/jwt');

exports.authenticate = (req, res, next) => {
  const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decoded = verifyJwt(token);
    req.user = decoded; // { userId, role, profileCompleted }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

exports.requireProfileCompletion = (req, res, next) => {
  if (!req.user.profileCompleted) {
    return res.status(403).json({ 
      message: 'Profile completion required.',
      requireProfileCompletion: true 
    });
  }
  next();
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