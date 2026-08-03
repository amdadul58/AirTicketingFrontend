import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) return <Loader label="Checking access" />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
