import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    emailVerificationExpires: {
      type: Date,
      select: false
    },
    resetToken: {
      type: String,
      select: false
    },
    resetTokenExpires: {
      type: Date,
      select: false
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lockedUntil: {
      type: Date
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    profile: {
      avatar: String,
      bio: String
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: true }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for email
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.passwordHash = await bcryptjs.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.passwordHash);
};

// Method to check if account is locked
userSchema.methods.isAccountLocked = function() {
  return this.lockedUntil && this.lockedUntil > new Date();
};

// Method to record failed login
userSchema.methods.recordFailedLogin = function() {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }
  return this.save();
};

// Method to reset login attempts
userSchema.methods.resetFailedLogin = function() {
  this.failedLoginAttempts = 0;
  this.lockedUntil = null;
  return this.save();
};

// Virtual for password field (for setting)
userSchema.virtual('password').set(function(value) {
  this.passwordHash = value;
});

// Remove sensitive fields on JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.emailVerificationToken;
  delete user.resetToken;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
