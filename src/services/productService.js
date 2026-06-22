import api from './api'

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getBrands: () => api.get('/products/brands'),
  getCategories: () => api.get('/products/categories'),
}

export const adminService = {
  getBrands: () => api.get('/admin/brands'),
  createBrand: (data) => api.post('/admin/brands', data),
  deleteBrand: (id) => api.delete(`/admin/brands/${id}`),
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getProductImages: (productId) => api.get(`/admin/products/${productId}/images`),
  addProductImage: (productId, data) =>
    api.post(`/admin/products/${productId}/images`, data),
  deleteProductImage: (productId, imageId) =>
    api.delete(`/admin/products/${productId}/images/${imageId}`),
}
