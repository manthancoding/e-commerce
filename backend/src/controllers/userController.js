import User from '../models/User.js';
import { Address, Order } from '../models/Address.js';
import { validate, schemas } from '../validators/schemas.js';
import { sanitizeUser } from '../middleware/auth.js';

// Profile Controllers
export const getUserProfile = async (req, res, next) => {
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

export const updateUserProfile = async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.updateProfile);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (value.full_name) user.fullName = value.full_name;
    if (value.phone) user.phone = value.phone;
    if (value.email && value.email !== user.email) {
      // Check if email is already in use
      const existingUser = await User.findOne({ email: value.email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already in use'
        });
      }
      user.email = value.email.toLowerCase();
    }

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

// Address Controllers
export const createAddress = async (req, res, next) => {
  try {
    const { error, value } = validate(req.body, schemas.address);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error
      });
    }

    // If this is default, unset other defaults
    if (value.is_default) {
      await Address.updateMany(
        { userId: req.user.userId },
        { isDefault: false }
      );
    }

    const address = new Address({
      userId: req.user.userId,
      addressLine1: value.address_line1,
      addressLine2: value.address_line2,
      city: value.city,
      state: value.state,
      postalCode: value.postal_code,
      country: value.country,
      isDefault: value.is_default || false
    });

    await address.save();

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: {
        address
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.user.userId }).sort({ isDefault: -1 });

    res.status(200).json({
      success: true,
      data: {
        addresses
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = validate(req.body, schemas.address);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error
      });
    }

    // Verify ownership
    const address = await Address.findById(id);
    if (!address || address.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // If this is default, unset other defaults
    if (value.is_default) {
      await Address.updateMany(
        { userId: req.user.userId, _id: { $ne: id } },
        { isDefault: false }
      );
    }

    address.addressLine1 = value.address_line1 || address.addressLine1;
    address.addressLine2 = value.address_line2 || address.addressLine2;
    address.city = value.city || address.city;
    address.state = value.state || address.state;
    address.postalCode = value.postal_code || address.postalCode;
    address.country = value.country || address.country;
    if (value.is_default !== undefined) address.isDefault = value.is_default;

    await address.save();

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: {
        address
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const address = await Address.findById(id);
    if (!address || address.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await Address.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Order Controllers
export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('shippingAddressId');

    const total = await Order.countDocuments({ userId: req.user.userId });

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('shippingAddressId');
    if (!order || order.userId.toString() !== req.user.userId) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// Wishlist Controllers (stored in local storage for now, can be extended to database)
export const getWishlist = async (req, res, next) => {
  try {
    // Wishlist is managed on frontend with localStorage
    // This endpoint can be expanded to persist wishlist in database
    res.status(200).json({
      success: true,
      message: 'Wishlist items retrieved from client storage',
      data: {
        wishlist: []
      }
    });
  } catch (error) {
    next(error);
  }
};

// Saved Payment Methods (tokenized only)
export const getSavedPaymentMethods = async (req, res, next) => {
  try {
    // Payment methods schema can be added to Address.js as needed
    res.status(200).json({
      success: true,
      data: {
        paymentMethods: []
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  // Profile
  getUserProfile,
  updateUserProfile,
  
  // Addresses
  createAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  
  // Orders
  getOrders,
  getOrderDetails,
  
  // Wishlist
  getWishlist,
  
  // Payment Methods
  getSavedPaymentMethods
};
