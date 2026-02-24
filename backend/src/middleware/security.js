import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  skipSuccessfulRequests: true, // don't count successful login
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return req.body.email || req.ip; // rate limit by email or IP
  }
});

// Strict rate limiter for password reset
export const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  message: 'Too many password reset attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Register account limiter
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 registrations per hour
  message: 'Too many accounts registered from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// CSRF Token validation middleware
let csrfTokens = new Set();

export const generateCSRFToken = () => {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.add(token);
  return token;
};

export const validateCSRFToken = (req, res, next) => {
  const token = req.headers['x-csrf-token'] || req.body.csrfToken;
  
  if (!token || !csrfTokens.has(token)) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }
  
  csrfTokens.delete(token);
  next();
};

export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
};

export default {
  generalLimiter,
  loginLimiter,
  resetPasswordLimiter,
  registerLimiter,
  generateCSRFToken,
  validateCSRFToken,
  corsOptions
};
