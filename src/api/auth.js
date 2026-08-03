import api from './axios'

export const registerUser = (payload) => api.post('/auth/register', payload)
export const loginUser = (payload) => api.post('/auth/login', payload)
export const refreshToken = (refresh_token) => api.post('/auth/refresh', { refresh_token })
export const sendEmailOtp = (email) => api.post('/auth/otp/send-verification', { email })
export const verifyEmailOtp = (email, code) => api.post('/auth/otp/verify', { email, code })
export const verifyLoginOtp = (otp_token, code) => api.post('/auth/otp/verify-login', { otp_token, code })
