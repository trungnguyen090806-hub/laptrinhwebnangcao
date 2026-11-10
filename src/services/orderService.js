import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    return await api.post('/orders', orderData);
  },

  getOrdersByUser: async (userId) => {
    return await api.get(`/orders/user/${userId}`);
  },

  getOrderById: async (id) => {
    return await api.get(`/orders/${id}`);
  },

  getAllOrders: async () => {
    return await api.get('/orders');
  },

  updateStatus: async (orderId, status) => {
    return await api.put(`/orders/${orderId}/status`, { status });
  }
};
