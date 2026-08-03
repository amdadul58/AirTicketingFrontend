import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser, sendEmailOtp } from '../../api/auth'
import { apiErrorMessage } from '../../utils/helpers'

export default function Register() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await registerUser(form)
      // Kick off email verification right away
      try {
        await sendEmailOtp(form.email)
      } catch {
        /* non-fatal — user can resend from the verify screen */
      }
      navigate('/verify-email', { state: { email: form.email } })
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <p className="eyebrow">Get started</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Create your account</h1>

      <form onSubmit={onSubmit} className="card mt-6 flex flex-col gap-4">
        {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="label">Full name</label>
          <input required name="full_name" className="input" value={form.full_name} onChange={onChange} />
        </div>
        <div>
          <label className="label">Email</label>
          <input required type="email" name="email" className="input" value={form.email} onChange={onChange} />
        </div>
        <div>
          <label className="label">Phone (optional)</label>
          <input name="phone" className="input" value={form.phone} onChange={onChange} />
        </div>
        <div>
          <label className="label">Password</label>
          <input required type="password" name="password" className="input" value={form.password} onChange={onChange} />
        </div>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-slate-450 mt-4 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-navy-900 font-medium underline underline-offset-4">
          Log in
        </Link>
      </p>
    </div>
  )
}
