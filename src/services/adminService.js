import api from './api';

export const adminService = {
  getStats: async () => {
    return await api.get('/admin/stats');
  },

  getUsers: async () => {
    return await api.get('/admin/users');
  }
};
