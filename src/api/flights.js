import api from './axios'

export const listFlights = (params) => api.get('/flights/', { params })
export const searchFlights = (origin, destination, date) =>
  api.get('/flights/search', { params: { origin, destination, date } })
export const getFlight = (id) => api.get(`/flights/${id}`)
export const createFlight = (payload) => api.post('/flights/', payload)
export const updateFlight = (id, payload) => api.put(`/flights/${id}`, payload)
export const deleteFlight = (id) => api.delete(`/flights/${id}`)
