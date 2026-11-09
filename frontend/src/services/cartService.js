import api from './api';

export const cartService = {
  getCart: async (userId) => {
    return await api.get(`/cart/${userId}`);
  },

  addToCart: async (userId, productId, quantity = 1) => {
    return await api.post('/cart/add', { userId, productId, quantity });
  },

  updateItemQuantity: async (itemId, quantity) => {
    return await api.put(`/cart/items/${itemId}`, { quantity });
  },

  removeItem: async (itemId) => {
    return await api.delete(`/cart/items/${itemId}`);
  },

  clearCart: async (userId) => {
    return await api.delete(`/cart/clear/${userId}`);
  }
};
