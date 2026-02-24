import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register, error: authError, isAuthenticated, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleChange = async (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Check password strength as user types
    if (name === 'password' && newValue) {
      try {
        const response = await apiService.getPasswordStrength(newValue);
        if (response.success) {
          setPasswordStrength(response.data);
        }
      } catch (err) {
        console.error('Error checking password strength:', err);
      }
    }

    // Clear specific error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (@$!%*?&)';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms & Conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      
      await register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      navigate('/verify-email');
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div className="auth-loading">Loading...</div>;
  }

  const getPasswordStrengthColor = () => {
    if (!passwordStrength) return '';
    const { strength } = passwordStrength;
    switch(strength) {
      case 'weak': return 'weak';
      case 'fair': return 'fair';
      case 'good': return 'good';
      case 'strong': return 'strong';
      case 'very strong': return 'very-strong';
      default: return '';
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box register-box">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us for secure shopping</p>
        </div>

        {(errors.submit || authError) && (
          <div className="auth-error">
            {errors.submit || authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={isLoading}
              required
            />
            {errors.full_name && <span className="error-message">{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={isLoading}
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              disabled={isLoading}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
            
            {passwordStrength && (
              <div className="password-strength">
                <div className={`strength-bar ${getPasswordStrengthColor()}`}></div>
                <div className="strength-requirements">
                  <span className={passwordStrength.requirements.min8Chars ? 'met' : ''}>
                    ✓ At least 8 characters
                  </span>
                  <span className={passwordStrength.requirements.hasUpperCase ? 'met' : ''}>
                    ✓ One uppercase letter
                  </span>
                  <span className={passwordStrength.requirements.hasLowerCase ? 'met' : ''}>
                    ✓ One lowercase letter
                  </span>
                  <span className={passwordStrength.requirements.hasNumber ? 'met' : ''}>
                    ✓ One number
                  </span>
                  <span className={passwordStrength.requirements.hasSpecialChar ? 'met' : ''}>
                    ✓ One special character (@$!%*?&)
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              disabled={isLoading}
            />
            <label htmlFor="acceptTerms">
              I accept the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
            </label>
            {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="google-button" disabled={isLoading}>
          <span>🔵</span> Sign up with Google
        </button>

        <div className="auth-signup">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
