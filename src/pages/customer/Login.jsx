import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { apiErrorMessage } from '../../utils/helpers'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await loginUser(form)
      if (data.otp_required && data.otp_token) {
        // 2FA is on for this account — continue to OTP verification
        navigate('/verify-login-otp', { state: { otp_token: data.otp_token, from: location.state?.from } })
        return
      }
      login(data)
      navigate(location.state?.from?.pathname || '/')
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <p className="eyebrow">Welcome back</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Log in</h1>

      <form onSubmit={onSubmit} className="card mt-6 flex flex-col gap-4">
        {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="label">Email</label>
          <input
            required
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            required
            type="password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="text-sm text-slate-450 mt-4 text-center">
        New here?{' '}
        <Link to="/register" className="text-navy-900 font-medium underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </div>
  )
}
