import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401);
    next(new Error('Not authorized. Token missing.'));
    return;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      next(new Error('Not authorized. User no longer exists.'));
      return;
    }

    next();
  } catch (_error) {
    res.status(401);
    next(new Error('Not authorized. Token invalid.'));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      res.status(403);
      next(new Error('Forbidden. You do not have permission for this action.'));
      return;
    }

    next();
  };
};

