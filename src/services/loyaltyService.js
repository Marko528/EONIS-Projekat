import api from './api'

export const loyaltyService = {
  getPoints: () => api.get('/loyalty/points'),
  getStatus: () => api.get('/loyalty/status'),
}
