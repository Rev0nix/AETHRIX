import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }).then((r) => r.data),
  getById: (id) => api.get(`/products/${id}`).then((r) => r.data.data),
  getFeatured: () => api.get('/products/featured').then((r) => r.data.data),
  getFlashSale: () => api.get('/products/flash-sale').then((r) => r.data.data),
  getRelated: (id) => api.get(`/products/${id}/related`).then((r) => r.data.data),
  searchSuggestions: (q) => api.get('/products/search-suggestions', { params: { q } }).then((r) => r.data.data),
  getReviews: (productId) => api.get(`/products/${productId}/reviews`).then((r) => r.data.data),
  createReview: (productId, data) => api.post(`/products/${productId}/reviews`, data).then((r) => r.data.data),

  // Admin
  create: (data) => api.post('/products', data).then((r) => r.data.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((r) => r.data.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
  uploadImages: (id, formData) =>
    api
      .post(`/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data.data),
};
