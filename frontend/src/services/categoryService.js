import api from './api';

export const categoryService = {
  getAll: async () => {
    return await api.get('/categories');
  },

  getById: async (id) => {
    return await api.get(`/categories/${id}`);
  },

  create: async (categoryData) => {
    return await api.post('/categories', categoryData);
  },

  update: async (id, categoryData) => {
    return await api.put(`/categories/${id}`, categoryData);
  },

  delete: async (id) => {
    return await api.delete(`/categories/${id}`);
  }
};
