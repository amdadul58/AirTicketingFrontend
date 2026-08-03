import api from './axios'

export const myNotifications = () => api.get('/notifications/me')
export const getNotification = (id) => api.get(`/notifications/${id}`)
export const deleteNotification = (id) => api.delete(`/notifications/${id}`)
export const markAsRead = (id) => api.post(`/notifications/${id}/read`)
