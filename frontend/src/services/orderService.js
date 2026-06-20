import api from './api';

export const orderService = {
  createRazorpayOrder: (amount) => api.post('/orders/razorpay', { amount }).then((r) => r.data),
  createOrder: (data) => api.post('/orders', data).then((r) => r.data.data),
  getMyOrders: () => api.get('/orders/myorders').then((r) => r.data.data),
  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data.data),
  track: (orderNumber) => api.get(`/orders/track/${orderNumber}`).then((r) => r.data.data),

  // Admin
  getAll: (params) => api.get('/orders', { params }).then((r) => r.data),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data).then((r) => r.data.data),
  getDashboardStats: () => api.get('/orders/stats/dashboard').then((r) => r.data.data),
};

export const couponService = {
  validate: (code, orderValue) => api.post('/coupons/validate', { code, orderValue }).then((r) => r.data.data),
  getAll: () => api.get('/coupons').then((r) => r.data.data),
  create: (data) => api.post('/coupons', data).then((r) => r.data.data),
  update: (id, data) => api.put(`/coupons/${id}`, data).then((r) => r.data.data),
  remove: (id) => api.delete(`/coupons/${id}`).then((r) => r.data),
};
