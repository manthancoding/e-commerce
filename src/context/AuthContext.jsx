import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('accessToken');
      if (savedToken) {
        try {
          const response = await apiService.getProfile(savedToken);
          if (response.success) {
            setUser(response.data.user);
            setToken(savedToken);
          } else {
            localStorage.removeItem('accessToken');
            setToken(null);
          }
        } catch (err) {
          localStorage.removeItem('accessToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await apiService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        return response;
      }
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    try {
      setError(null);
      const response = await apiService.login(email, password, rememberMe);
      if (response.success) {
        setUser(response.data.user);
        setToken(response.data.accessToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        if (rememberMe) {
          localStorage.setItem('rememberMe', email);
        }
        return response;
      }
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('rememberMe');
      setError(null);
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      setError(null);
      if (!token) throw new Error('No authentication token');
      const response = await apiService.updateProfile(token, userData);
      if (response.success) {
        setUser(response.data.user);
        return response;
      }
    } catch (err) {
      const errorMessage = err.message || 'Profile update failed';
      setError(errorMessage);
      throw err;
    }
  }, [token]);

  const changePassword = useCallback(async (currentPassword, newPassword, confirmPassword) => {
    try {
      setError(null);
      if (!token) throw new Error('No authentication token');
      const response = await apiService.changePassword(token, currentPassword, newPassword, confirmPassword);
      if (response.success) {
        return response;
      }
    } catch (err) {
      const errorMessage = err.message || 'Password change failed';
      setError(errorMessage);
      throw err;
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user && !!token,
    register,
    login,
    logout,
    updateProfile,
    changePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
