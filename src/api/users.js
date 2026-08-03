import api from './axios'

export const getMyProfile = () => api.get('/users/me')
export const updateMyProfile = (payload) => api.put('/users/me', payload)
export const changeMyPassword = (payload) => api.put('/users/me/password', payload)
export const toggle2FA = (enabled) => api.put('/users/me/2fa', { enabled })

export const listUsers = (params) => api.get('/users/', { params })
export const getUser = (id) => api.get(`/users/${id}`)
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload)
export const deleteUser = (id) => api.delete(`/users/${id}`)
