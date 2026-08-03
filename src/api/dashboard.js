import api from "./axios";

// =========================
// Admin Dashboard
// =========================
export const getSummary = () => api.get("/dashboard/summary");

export const getRevenueSeries = (days = 30) =>
  api.get("/dashboard/revenue", {
    params: { days },
  });

export const getRecentBookings = (limit = 10) =>
  api.get("/dashboard/recent-bookings", {
    params: { limit },
  });

// =========================
// Customer Dashboard
// =========================
export const getCustomerDashboard = () =>
  api.get("/dashboard/customer");