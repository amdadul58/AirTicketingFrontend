import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { verifyLoginOtp } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import { apiErrorMessage } from '../../utils/helpers'

export default function VerifyLoginOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()
  const otpToken = location.state?.otp_token
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!otpToken) return <Navigate to="/login" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await verifyLoginOtp(otpToken, code)
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
      <p className="eyebrow">Two-factor verification</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Enter your code</h1>
      <p className="text-slate-450 text-sm mt-2">We sent a one-time code to your email.</p>

      <form onSubmit={onSubmit} className="card mt-6 flex flex-col gap-4">
        {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="label">Verification code</label>
          <input
            required
            className="input font-mono tracking-[0.3em] text-center text-lg"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Verifying…' : 'Verify & log in'}
        </button>
      </form>
    </div>
  )
}
