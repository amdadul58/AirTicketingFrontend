import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { verifyEmailOtp, sendEmailOtp } from '../../api/auth'
import { apiErrorMessage } from '../../utils/helpers'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyEmailOtp(email, code)
      navigate('/login')
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    setError('')
    setInfo('')
    try {
      await sendEmailOtp(email)
      setInfo('A new code has been sent to your email.')
    } catch (err) {
      setError(apiErrorMessage(err))
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <p className="eyebrow">Almost there</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Verify your email</h1>

      <form onSubmit={onSubmit} className="card mt-6 flex flex-col gap-4">
        {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}
        {info && <div className="text-ok text-sm bg-ok/10 rounded-lg px-3 py-2">{info}</div>}
        <div>
          <label className="label">Email</label>
          <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
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
          {loading ? 'Verifying…' : 'Verify email'}
        </button>
        <button type="button" onClick={resend} className="btn btn-ghost text-sm">
          Resend code
        </button>
      </form>
    </div>
  )
}
