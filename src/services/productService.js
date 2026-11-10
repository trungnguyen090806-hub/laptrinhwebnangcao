import api from './api';

export const productService = {
  getAll: async (params = {}) => {
    const { keyword, categoryId, sort } = params;
    const query = new URLSearchParams();
    if (keyword) query.append('keyword', keyword);
    if (categoryId) query.append('categoryId', categoryId);
    if (sort) query.append('sort', sort);

    const queryString = query.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    return await api.get(url);
  },

  getFeatured: async () => {
    return await api.get('/products/featured');
  },

  getById: async (id) => {
    return await api.get(`/products/${id}`);
  },

  create: async (productData) => {
    return await api.post('/products', productData);
  },

  update: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },

  delete: async (id) => {
    return await api.delete(`/products/${id}`);
  }
};
