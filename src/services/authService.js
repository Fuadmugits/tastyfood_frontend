import api from './api';

// Admin mock credentials for local testing when backend is offline
const MOCK_ADMIN_EMAIL = 'admin@tastyfood.com';
const MOCK_ADMIN_PASSWORD = 'admintastyfood';

const authService = {
  login: async (email, password) => {
    try {
      // Try to hit backend login API first
      // Assuming endpoint /api/login or /api/admin/login
      const response = await api.post('/login', { email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user || { name: 'Admin Tasty Food', email }));
        return { success: true, user: response.data.user };
      }
    } catch (error) {
      console.warn('Backend login connection failed or rejected, falling back to mock authentication:', error.message);
      
      // Fallback Mock authentication
      if (email === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASSWORD) {
        const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substr(2);
        const mockUser = { name: 'Administrator Tasty Food', email: MOCK_ADMIN_EMAIL };
        
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('admin_user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      } else {
        throw new Error('Email atau password salah!');
      }
    }
    throw new Error('Terjadi kesalahan pada respon server.');
  },

  logout: async () => {
    try {
      // Call logout API
      await api.post('/logout');
    } catch (error) {
      console.warn('Backend logout failed, clearing local storage anyway.');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('admin_user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return localStorage.getItem('auth_token') !== null;
  }
};

export default authService;
