const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const adminFetch = async (path, token, options = {}) => {
  const res = await fetch(`${API_BASE_URL}/admin${path}`, {
    ...options,
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const adminService = {
  getStats: (token) => adminFetch('/stats', token),
  getTrend: (token) => adminFetch('/stats/trend', token),
  getRides: (token, params = {}) => adminFetch(`/rides?${new URLSearchParams(params)}`, token),
  getLiveRides: (token) => adminFetch('/rides/live', token),
  getRideById: (token, id) => adminFetch(`/rides/${id}`, token),
  cancelRide: (token, id) => adminFetch(`/rides/${id}/cancel`, token, { method: 'PUT' }),
  getUsers: (token, params = {}) => adminFetch(`/users?${new URLSearchParams(params)}`, token),
  getUserById: (token, id) => adminFetch(`/users/${id}`, token),
  getTransactions: (token, params = {}) => adminFetch(`/transactions?${new URLSearchParams(params)}`, token),
  getReviews: (token, params = {}) => adminFetch(`/reviews?${new URLSearchParams(params)}`, token),
};
