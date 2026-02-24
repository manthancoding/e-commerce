import Joi from 'joi';

// Password validation schema
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  });

export const schemas = {
  register: Joi.object({
    full_name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().regex(/^\+?[0-9]{10,15}$/).optional().allow(''),
    password: passwordSchema,
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    rememberMe: Joi.boolean().optional()
  }),

  updateProfile: Joi.object({
    full_name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().regex(/^\+?[0-9]{10,15}$/).optional().allow('')
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: passwordSchema,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: passwordSchema,
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  }),

  address: Joi.object({
    address_line1: Joi.string().max(100).required(),
    address_line2: Joi.string().max(100).optional().allow(''),
    city: Joi.string().max(50).required(),
    state: Joi.string().max(50).required(),
    postal_code: Joi.string().max(20).required(),
    country: Joi.string().max(50).required(),
    is_default: Joi.boolean().optional()
  })
};

export const validate = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const errors = {};
    error.details.forEach(detail => {
      const field = detail.path.join('.');
      errors[field] = detail.message;
    });
    return { error: errors };
  }

  return { value, error: null };
};

// Calculate password strength
export const calculatePasswordStrength = (password) => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  
  // Return strength level
  if (strength <= 2) return 'weak';
  if (strength <= 3) return 'fair';
  if (strength <= 4) return 'good';
  if (strength <= 5) return 'strong';
  return 'very strong';
};

export default {
  schemas,
  validate,
  calculatePasswordStrength
};
