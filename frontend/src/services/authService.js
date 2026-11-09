import api from './api';

export const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  getProfile: async (userId) => {
    return await api.get(`/auth/profile/${userId}`);
  },

  getAllUsers: async () => {
    return await api.get('/auth/users');
  }
};
