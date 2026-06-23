import axios from 'axios';

const api = axios.create({
  baseURL: 'https://aethrix.onrender.com/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aethrix_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('aethrix_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err.response?.data || { message: 'Network error' });
  }
);

export default api;
