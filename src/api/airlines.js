import api from './axios'

export const listAirlines = (params) => api.get('/airlines/', { params })
export const getAirline = (id) => api.get(`/airlines/${id}`)
export const createAirline = (payload) => api.post('/airlines/', payload)
export const updateAirline = (id, payload) => api.put(`/airlines/${id}`, payload)
export const deleteAirline = (id) => api.delete(`/airlines/${id}`)
