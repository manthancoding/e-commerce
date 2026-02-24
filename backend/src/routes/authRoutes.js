import express from 'express';
import * as authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { loginLimiter, resetPasswordLimiter, registerLimiter } from '../middleware/security.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', registerLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', resetPasswordLimiter, authController.forgotPassword);
router.post('/reset-password', resetPasswordLimiter, authController.resetPassword);
router.post('/password-strength', authController.getPasswordStrength);

// Protected routes (authentication required)
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

export default router;
