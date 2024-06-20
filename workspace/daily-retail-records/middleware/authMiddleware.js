const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  // Extracting the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.status(403).json({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Token verified');
  } catch (error) {
    console.error('Invalid Token', error);
    return res.status(401).json({ message: 'Invalid Token', error: error.message });
  }

  return next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(`User role ${req.user.role} not authorized`);
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }
    console.log(`User role ${req.user.role} authorized`);
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };