
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (token) {
      next();
  } else {
      res.status(403).json({ message: 'Forbidden' });
  }
};

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization 
    && req.headers.authorization.startsWith('Bearer')) {
    
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findOne({userId: decoded.id}).select('-password -securityAnswer');

      next();

    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = {protect};