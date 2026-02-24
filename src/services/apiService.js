const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_BASE_URL);

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

export const apiService = {
  // Auth endpoints
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  async login(email, password, rememberMe = false) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, rememberMe })
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(response);
  },

  async verifyEmail(token) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    return handleResponse(response);
  },

  async forgotPassword(email) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse(response);
  },

  async resetPassword(token, newPassword, confirmPassword) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword, confirmPassword })
    });
    return handleResponse(response);
  },

  async getPasswordStrength(password) {
    const response = await fetch(`${API_BASE_URL}/auth/password-strength`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return handleResponse(response);
  },

  // User endpoints (require authentication)
  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  async updateProfile(token, userData) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  async changePassword(token, currentPassword, newPassword, confirmPassword) {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
    });
    return handleResponse(response);
  },

  // Address endpoints
  async createAddress(token, addressData) {
    const response = await fetch(`${API_BASE_URL}/user/addresses`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(addressData)
    });
    return handleResponse(response);
  },

  async getAddresses(token) {
    const response = await fetch(`${API_BASE_URL}/user/addresses`, {
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  async updateAddress(token, addressId, addressData) {
    const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(addressData)
    });
    return handleResponse(response);
  },

  async deleteAddress(token, addressId) {
    const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Order endpoints
  async getOrders(token, page = 1, limit = 10) {
    const response = await fetch(`${API_BASE_URL}/user/orders?page=${page}&limit=${limit}`, {
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  async getOrderDetails(token, orderId) {
    const response = await fetch(`${API_BASE_URL}/user/orders/${orderId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Wishlist endpoints
  async getWishlist(token) {
    const response = await fetch(`${API_BASE_URL}/user/wishlist`, {
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    return handleResponse(response);
  },

  // Payment Methods endpoints
  async getSavedPaymentMethods(token) {
    const response = await fetch(`${API_BASE_URL}/user/payment-methods`, {
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    return handleResponse(response);
  }
};

export default apiService;
