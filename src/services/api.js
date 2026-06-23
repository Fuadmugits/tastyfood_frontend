import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});


api.interceptors.request.use(
  (config) => {
    
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
    }

    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized - redirecting to login');
          break;
        case 403:
          console.warn('Forbidden');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 422:
          console.warn('Validation error:', error.response.data);
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API Error:', error.response.status);
      }
    } else if (error.request) {
      console.error('Network error - no response received');
    }
    return Promise.reject(error);
  }
);

export default api;
