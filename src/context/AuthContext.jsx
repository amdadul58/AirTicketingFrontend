import { createContext, useContext, useEffect, useState } from 'react'
import { getMyProfile } from '../api/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      setLoading(false)
      return
    }
    getMyProfile()
      .then(({ data }) => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
      })
      .catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = (tokenData) => {
    if (tokenData.access_token) localStorage.setItem('access_token', tokenData.access_token)
    if (tokenData.refresh_token) localStorage.setItem('refresh_token', tokenData.refresh_token)
    if (tokenData.user) {
      localStorage.setItem('user', JSON.stringify(tokenData.user))
      setUser(tokenData.user)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateUser = (u) => {
    setUser(u)
    localStorage.setItem('user', JSON.stringify(u))
  }

  const isAdmin = user?.role_name && ['admin', 'staff', 'super_admin'].includes(user.role_name.toLowerCase())

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
