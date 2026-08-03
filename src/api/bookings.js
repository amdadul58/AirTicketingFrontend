import api from './axios'

export const bookFlight = (payload) => api.post('/bookings/', payload)
export const myBookings = () => api.get('/bookings/me')
export const getBooking = (id) => api.get(`/bookings/${id}`)
export const removeBooking = (id) => api.delete(`/bookings/${id}`)
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel`)
