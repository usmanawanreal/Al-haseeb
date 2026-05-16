const jwt = require('jsonwebtoken');
const User = require('../models/User');

/** Attaches req.user when a valid Bearer token is sent; continues without user otherwise. */
const optionalProtect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer')) {
    return next();
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'alhaseeb_secret_key');
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch {
    /* ignore invalid token for public booking */
  }
  return next();
};

module.exports = { optionalProtect };
