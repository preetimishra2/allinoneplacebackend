const jwt = require('jsonwebtoken');
const User = require('../models/User');


// @desc Middleware to protect routes (authentication) and ensure the user is not an admin
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: 'Invalid token, authorization denied' });
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      // Ensure that only non-admin users can access cart
      if (req.user.isAdmin) {
        return res.status(403).json({ message: 'Admins cannot access the cart page' });
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired, please log in again' });
      }
      console.error("Authorization error:", error.message);
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
};



// @desc Middleware to check admin privileges (authorization)
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied, not an admin' });
  }
};

module.exports = { protect, admin };
