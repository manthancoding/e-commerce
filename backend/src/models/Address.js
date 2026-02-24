import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'Postal code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Index for user_id
addressSchema.index({ userId: 1, isDefault: -1 });

const Address = mongoose.model('Address', addressSchema);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    items: [
      {
        productId: String,
        productName: String,
        quantity: Number,
        price: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    shippingAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    },
    trackingNumber: String,
    notes: String
  },
  { timestamps: true }
);

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

const Order = mongoose.model('Order', orderSchema);

export { Address, Order };
export default { Address, Order };
