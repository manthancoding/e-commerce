import User from '../models/User.js';
import { generateTokens } from '../utils/jwt.js';
import { validate, schemas, calculatePasswordStrength } from '../validators/schemas.js';
import { sanitizeUser } from '../middleware/auth.js';
import crypto from 'crypto';

// LoginLog model will be created inline for now
import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: String,
  status: { type: String, enum: ['success', 'failed'] },
  ipAddress: String,
  userAgent: String
}, { timestamps: true });

const LoginLog = mongoose.model('LoginLog', loginLogSchema);

export const register = async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.register);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: value.email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user with Mongoose
    const user = new User({
      fullName: value.full_name,
      email: value.email.toLowerCase(),
      phone: value.phone || null,
      passwordHash: value.password
    });

    // Mongoose pre-save hook will hash password automatically
    await user.save();

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // In production, send verification email here
    // await sendVerificationEmail(user.email, verificationToken);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.email, user.role);

    // Set secure cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        user: sanitizeUser(user),
        accessToken,
        verificationRequired: true
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.login);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error
      });
    }

    // Find user and explicitly select password field
    const user = await User.findOne({ email: value.email.toLowerCase() }).select('+passwordHash');

    // User not found
    if (!user) {
      // Log failed attempt
      await LoginLog.create({
        email: value.email,
        status: 'failed',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      return res.status(429).json({
        success: false,
        message: 'Account is locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Verify password using Mongoose method
    const isPasswordValid = await user.comparePassword(value.password);
    if (!isPasswordValid) {
      await user.recordFailedLogin();
      
      // Log failed attempt
      await LoginLog.create({
        userId: user._id,
        email: user.email,
        status: 'failed',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Record successful login
    await user.resetFailedLogin();
    
    // Log successful login
    await LoginLog.create({
      userId: user._id,
      email: user.email,
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id, user.email, user.role);

    // Set secure cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(user),
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.forgotPassword);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error
      });
    }

    const user = await User.findOne({ email: value.email.toLowerCase() });
    
    // Don't reveal if email exists for security reasons
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetToken = resetToken;
      user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
      await user.save();
      
      // In production, send reset email here
      // await sendPasswordResetEmail(user.email, resetToken);
      console.log('Password reset token:', resetToken); // Remove in production
    }

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been sent'
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.resetPassword);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error
      });
    }

    const user = await User.findOne({
      resetToken: value.token,
      resetTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.passwordHash = value.newPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.updateProfile);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error
      });
    }

    // Check if new email is already in use
    if (value.email && value.email !== req.user.email) {
      const existingUser = await User.findOne({ email: value.email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    const user = await User.findById(req.user.userId);
    if (value.full_name) user.fullName = value.full_name;
    if (value.phone) user.phone = value.phone;
    if (value.email) user.email = value.email.toLowerCase();
    
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: sanitizeUser(user)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.changePassword);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error
      });
    }

    const user = await User.findById(req.user.userId).select('+passwordHash');
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(value.currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update to new password
    user.passwordHash = value.newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getPasswordStrength = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    const strength = calculatePasswordStrength(password);

    res.status(200).json({
      success: true,
      data: {
        strength,
        requirements: {
          min8Chars: password.length >= 8,
          hasUpperCase: /[A-Z]/.test(password),
          hasLowerCase: /[a-z]/.test(password),
          hasNumber: /\d/.test(password),
          hasSpecialChar: /[@$!%*?&]/.test(password)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  getPasswordStrength
};
