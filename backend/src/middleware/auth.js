import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or account deactivated'
      });
    }

    req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export const adminMiddleware = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  const errors = err.errors || null;

  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
};

// Sanitize user data - works with Mongoose documents
export const sanitizeUser = (user) => {
  if (!user) return null;
  
  // Convert Mongoose document to plain object
  const userObj = user.toObject ? user.toObject() : { ...user };
  
  // Remove sensitive fields
  delete userObj.passwordHash;
  delete userObj.resetToken;
  delete userObj.emailVerificationToken;
  delete userObj.__v;
  
  return userObj;
};

export default {
  authMiddleware,
  adminMiddleware,
  errorHandler,
  notFoundHandler,
  sanitizeUser
};
