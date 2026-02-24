import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/apiService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout, loading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Load profile data
  useEffect(() => {
    if (token && isAuthenticated) {
      loadDashboardData();
    }
  }, [token, isAuthenticated]);

  const loadDashboardData = async () => {
    try {
      setPageLoading(true);
      if (activeTab === 'profile') {
        const response = await apiService.getProfile(token);
        if (response.success) {
          setProfileData(response.data.user);
        }
      } else if (activeTab === 'addresses') {
        const response = await apiService.getAddresses(token);
        if (response.success) {
          setAddresses(response.data.addresses);
        }
      } else if (activeTab === 'orders') {
        const response = await apiService.getOrders(token);
        if (response.success) {
          setOrders(response.data.orders);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <h3>{user?.full_name}</h3>
            <p>{user?.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('profile');
              loadDashboardData();
            }}
          >
            <span>👤</span> Profile
          </button>
          <button
            className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('addresses');
              loadDashboardData();
            }}
          >
            <span>📍</span> Addresses
          </button>
          <button
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('orders');
              loadDashboardData();
            }}
          >
            <span>📦</span> Orders
          </button>
          <button
            className={`nav-item ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <span>🔐</span> Security
          </button>
          <button
            className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <span>❤️</span> Wishlist
          </button>
          <button
            className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span>💳</span> Payment Methods
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span> Logout
        </button>
      </div>

      <div className="dashboard-content">
        {pageLoading ? (
          <div className="content-loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'profile' && <ProfileTab user={profileData} token={token} onUpdate={() => loadDashboardData()} />}
            {activeTab === 'addresses' && <AddressesTab addresses={addresses} token={token} onUpdate={() => loadDashboardData()} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} token={token} />}
            {activeTab === 'password' && <SecurityTab token={token} />}
            {activeTab === 'wishlist' && <WishlistTab />}
            {activeTab === 'payments' && <PaymentMethodsTab token={token} />}
          </>
        )}
      </div>
    </div>
  );
};

// Profile Tab Component
const ProfileTab = ({ user, token, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await apiService.updateProfile(token, formData);
      setSuccess('Profile updated successfully');
      setEditMode(false);
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-tab">
      <h2>Profile Information</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="profile-card">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            disabled={!editMode || isLoading}
            placeholder="Your full name"
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!editMode || isLoading}
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!editMode || isLoading}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="form-actions">
          {!editMode ? (
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>
              ✎ Edit Profile
            </button>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Saving...' : '✓ Save Changes'}
              </button>
              <button className="btn btn-secondary" onClick={() => setEditMode(false)} disabled={isLoading}>
                ✕ Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Addresses Tab Component
const AddressesTab = ({ addresses, token, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    is_default: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await apiService.createAddress(token, formData);
      setFormData({
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        is_default: false
      });
      setShowAddForm(false);
      onUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await apiService.deleteAddress(token, addressId);
        onUpdate();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="dashboard-tab">
      <div className="tab-header">
        <h2>Saved Addresses</h2>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '+ Add Address'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showAddForm && (
        <div className="address-form">
          <h3>Add New Address</h3>
          <div className="form-group">
            <label>Address Line 1</label>
            <input
              type="text"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              placeholder="123 Main Street"
            />
          </div>
          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleChange}
              placeholder="Apt, Suite, etc."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
            />
            <label>Set as default address</label>
          </div>
          <button className="btn btn-primary" onClick={handleAddAddress} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Address'}
          </button>
        </div>
      )}

      <div className="addresses-list">
        {addresses && addresses.length > 0 ? (
          addresses.map(address => (
            <div key={address.id} className={`address-card ${address.is_default ? 'default' : ''}`}>
              {address.is_default && <span className="default-badge">Default</span>}
              <p className="address-text">
                {address.address_line1}
                {address.address_line2 && `, ${address.address_line2}`}
              </p>
              <p className="address-text">
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p className="address-text">{address.country}</p>
              <button className="btn-danger" onClick={() => handleDeleteAddress(address.id)}>
                🗑️ Delete
              </button>
            </div>
          ))
        ) : (
          <p className="empty-state">No addresses saved yet.</p>
        )}
      </div>
    </div>
  );
};

// Orders Tab Component
const OrdersTab = ({ orders, token }) => {
  return (
    <div className="dashboard-tab">
      <h2>Order History</h2>
      <div className="orders-list">
        {orders && orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Order #{order.id.substring(0, 8)}</span>
                <span className={`order-status status-${order.order_status}`}>
                  {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                </span>
              </div>
              <p className="order-date">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="order-amount">₹{parseInt(order.total_amount).toLocaleString('en-IN')}</p>
              <div className="order-progress">
                <span className="progress-step completed">Ordered</span>
                <span className={`progress-step ${order.order_status !== 'pending' ? 'completed' : ''}`}>Processing</span>
                <span className={`progress-step ${order.order_status === 'shipped' || order.order_status === 'delivered' ? 'completed' : ''}`}>Shipped</span>
                <span className={`progress-step ${order.order_status === 'delivered' ? 'completed' : ''}`}>Delivered</span>
              </div>
              {order.tracking_number && <p className="tracking">Tracking: {order.tracking_number}</p>}
            </div>
          ))
        ) : (
          <p className="empty-state">No orders yet. Start shopping!</p>
        )}
      </div>
    </div>
  );
};

// Security Tab Component
const SecurityTab = ({ token }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await apiService.changePassword(
        token,
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      setSuccess('Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-tab">
      <h2>Security Settings</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="security-card">
        <h3>Change Password</h3>
        
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            disabled={isLoading}
          />
        </div>

        <div className="form-group checkbox">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          <label>Show passwords</label>
        </div>

        <button className="btn btn-primary" onClick={handleChangePassword} disabled={isLoading}>
          {isLoading ? 'Updating...' : '🔐 Change Password'}
        </button>
      </div>
    </div>
  );
};

// Wishlist Tab Component
const WishlistTab = () => {
  const [wishlist, setWishlist] = React.useState([]);

  React.useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="dashboard-tab">
      <h2>My Wishlist</h2>
      {wishlist.length > 0 ? (
        <div className="wishlist-items">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-item">
              <p>{item.name}</p>
              <p className="price">₹{item.price.toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-state">Your wishlist is empty.</p>
      )}
    </div>
  );
};

// Payment Methods Tab Component
const PaymentMethodsTab = ({ token }) => {
  const [paymentMethods, setPaymentMethods] = React.useState([]);

  React.useEffect(() => {
    loadPaymentMethods();
  }, [token]);

  const loadPaymentMethods = async () => {
    try {
      const response = await apiService.getSavedPaymentMethods(token);
      if (response.success) {
        setPaymentMethods(response.data.paymentMethods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  return (
    <div className="dashboard-tab">
      <h2>Payment Methods</h2>
      <div className="payment-methods-list">
        {paymentMethods && paymentMethods.length > 0 ? (
          paymentMethods.map(method => (
            <div key={method.id} className={`payment-card ${method.is_default ? 'default' : ''}`}>
              <p className="card-brand">{method.card_brand || 'Card'}</p>
              <p className="card-number">•••• •••• •••• {method.last_four_digits}</p>
              <p className="expiry">Exp: {method.expiry_month}/{method.expiry_year}</p>
              {method.is_default && <span className="default-badge">Default</span>}
            </div>
          ))
        ) : (
          <p className="empty-state">No saved payment methods.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
