import api from './axios'

export const listSettings = () => api.get('/settings/')
export const getSetting = (key) => api.get(`/settings/${key}`)
export const updateSetting = (key, value) => api.put('/settings/', { key, value })
export const deleteSetting = (key) => api.delete(`/settings/${key}`)
