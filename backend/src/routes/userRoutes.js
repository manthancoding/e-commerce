import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

// Profile routes
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

// Address routes
router.post('/addresses', userController.createAddress);
router.get('/addresses', userController.getAddresses);
router.put('/addresses/:id', userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);

// Order routes
router.get('/orders', userController.getOrders);
router.get('/orders/:id', userController.getOrderDetails);

// Wishlist routes
router.get('/wishlist', userController.getWishlist);

// Payment Methods routes
router.get('/payment-methods', userController.getSavedPaymentMethods);

export default router;
