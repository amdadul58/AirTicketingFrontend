import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Home from './pages/customer/Home'
import Login from './pages/customer/Login'
import Register from './pages/customer/Register'
import VerifyEmail from './pages/customer/VerifyEmail'
import VerifyLoginOtp from './pages/customer/VerifyLoginOtp'
import FlightDetails from './pages/customer/FlightDetails'
import BookingForm from './pages/customer/BookingForm'
import Payment from './pages/customer/Payment'
import PaymentResult from './pages/customer/PaymentResult'
import CustomerDashboard from './pages/customer/Dashboard'   // ✅ নতুন
import MyBookings from './pages/customer/MyBookings'
import Profile from './pages/customer/Profile'
import Notifications from './pages/customer/Notifications'

import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Airlines from './pages/admin/Airlines'
import Flights from './pages/admin/Flights'
import Users from './pages/admin/Users'
import Payments from './pages/admin/Payments'
import Refunds from './pages/admin/Refunds'
import Reports from './pages/admin/Reports'
import Settings from './pages/admin/Settings'
import AuditLogs from './pages/admin/AuditLogs'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Customer */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-login-otp" element={<VerifyLoginOtp />} />
          <Route path="/flights/:id" element={<FlightDetails />} />

          <Route
            path="/book/:flightId"
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pay/:bookingId"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-result"
            element={
              <ProtectedRoute>
                <PaymentResult />
              </ProtectedRoute>
            }
          />

          {/* ✅ Customer Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="airlines" element={<Airlines />} />
            <Route path="flights" element={<Flights />} />
            <Route path="users" element={<Users />} />
            <Route path="payments" element={<Payments />} />
            <Route path="refunds" element={<Refunds />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="audit-logs" element={<AuditLogs />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <div className="max-w-lg mx-auto text-center py-24 px-4">
      <p className="eyebrow">Error 404</p>
      <h1 className="text-3xl font-semibold mt-2 text-navy-900">
        This gate doesn't exist
      </h1>
      <p className="text-slate-450 mt-2">
        The page you're looking for has already departed.
      </p>
    </div>
  )
}