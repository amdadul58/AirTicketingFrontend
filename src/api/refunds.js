import api from './axios'

export const createRefundRequest = (payload) => api.post('/refunds/', payload)
export const listRefunds = (params) => api.get('/refunds/', { params })
export const getRefund = (id) => api.get(`/refunds/${id}`)
export const approveRefund = (id) => api.post(`/refunds/${id}/approve`)
export const rejectRefund = (id, reason) => api.post(`/refunds/${id}/reject`, { reason })
