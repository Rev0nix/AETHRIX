import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data).then((r) => r.data.data),
  login: (data) => api.post('/auth/login', data).then((r) => r.data.data),
  getMe: () => api.get('/auth/me').then((r) => r.data.data),
  updateProfile: (data) => api.put('/auth/profile', data).then((r) => r.data.data),
  addAddress: (data) => api.post('/auth/address', data).then((r) => r.data.data),
  deleteAddress: (id) => api.delete(`/auth/address/${id}`).then((r) => r.data.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }).then((r) => r.data),
};
