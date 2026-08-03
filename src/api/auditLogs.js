import api from './axios'

export const listAuditLogs = (limit = 50) => api.get('/audit-logs/', { params: { limit } })
export const getAuditLog = (id) => api.get(`/audit-logs/${id}`)
export const deleteAuditLog = (id) => api.delete(`/audit-logs/${id}`)
