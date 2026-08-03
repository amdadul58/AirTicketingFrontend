import api from './axios'

export const getRevenueReport = (days = 30) =>
  api.get('/dashboard/revenue', {
    params: { days }
  })

export const getBookingsByStatus = () =>
  api.get('/reports/bookings-by-status')

export const getTopAirlines = (limit = 10) =>
  api.get('/reports/top-airlines', {
    params: { limit }
  })

export const getTopRoutes = (limit = 10) =>
  api.get('/reports/top-routes', {
    params: { limit }
  })

export const getTopUsers = (limit = 10) =>
  api.get('/reports/users', {
    params: { limit }
  })