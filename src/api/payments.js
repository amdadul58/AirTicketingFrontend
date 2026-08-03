import api from './axios'

export const payForBooking = (payload) => api.post('/payments/', payload)
export const listPayments = (params) => api.get('/payments/', { params })
export const getPayment = (id) => api.get(`/payments/${id}`)
export const confirmTestCardPayment = (id, payment_method = 'pm_card_visa') =>
  api.post(`/payments/${id}/confirm-test`, { payment_method })
