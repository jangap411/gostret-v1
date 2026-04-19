const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SOCKET_URL = API_BASE_URL.replace('/api', '');

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }
    return data;
  },
};

export const rideService = {
  requestRide: async (rideData, token) => {
    const response = await fetch(`${API_BASE_URL}/rides`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rideData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Ride request failed');
    return data;
  },

  getActiveRide: async (token) => {
    const response = await fetch(`${API_BASE_URL}/rides/active`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch active ride');
    return data;
  },

  getRideHistory: async (token) => {
    const response = await fetch(`${API_BASE_URL}/rides/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch history');
    return data;
  },

  updateRideStatus: async (id, status, token) => {
    const response = await fetch(`${API_BASE_URL}/rides/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Status update failed');
    return data;
  },

  sendReceipt: async (id, token) => {
    const response = await fetch(`${API_BASE_URL}/rides/${id}/receipt`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to send receipt');
    return data;
  },
};

export const userService = {
  getProfile: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');
    return data;
  },

  updateProfile: async (profileData, token) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  topUpWallet: async (amount, token) => {
    const response = await fetch(`${API_BASE_URL}/user/wallet/top-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to top up wallet');
    return data;
  },

  getTransactions: async (token) => {
    const response = await fetch(`${API_BASE_URL}/user/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch transactions');
    return data;
  },
};

export const reviewService = {
  addReview: async (reviewData, token) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to submit review');
    return data;
  },
};
