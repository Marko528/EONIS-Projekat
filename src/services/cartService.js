import api from './api'

export const cartService = {
  getCart: () => api.get('/cart'),
  addItem: (productId, sizeId, quantity) => api.post('/cart', { productId, sizeId, quantity }),
  updateItem: (cartItemId, quantity) => api.put(`/cart/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => api.delete(`/cart/${cartItemId}`),
  clearCart: () => api.delete('/cart'),
}
