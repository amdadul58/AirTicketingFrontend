import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { updateMyProfile, changeMyPassword, toggle2FA } from '../../api/users'
import { apiErrorMessage } from '../../utils/helpers'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState({ full_name: user.full_name, email: user.email, phone: user.phone || '' })
  const [pw, setPw] = useState({ current_password: '', new_password: '' })
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })
  const [twoFaBusy, setTwoFaBusy] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  const onSaveProfile = async (e) => {
    e.preventDefault()
    setProfileMsg({ type: '', text: '' })
    setSavingProfile(true)
    try {
      const { data } = await updateMyProfile(profile)
      updateUser(data)
      setProfileMsg({ type: 'ok', text: 'Profile updated.' })
    } catch (err) {
      setProfileMsg({ type: 'err', text: apiErrorMessage(err) })
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangePassword = async (e) => {
    e.preventDefault()
    setPwMsg({ type: '', text: '' })
    setSavingPw(true)
    try {
      await changeMyPassword(pw)
      setPwMsg({ type: 'ok', text: 'Password changed.' })
      setPw({ current_password: '', new_password: '' })
    } catch (err) {
      setPwMsg({ type: 'err', text: apiErrorMessage(err) })
    } finally {
      setSavingPw(false)
    }
  }

  const onToggle2FA = async () => {
    setTwoFaBusy(true)
    try {
      const { data } = await toggle2FA(!user.otp_enabled)
      updateUser(data)
    } catch {
      /* silent */
    } finally {
      setTwoFaBusy(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 flex flex-col gap-8">
      <div>
        <p className="eyebrow">Account</p>
        <h1 className="text-3xl font-semibold text-navy-900 mt-2">Your profile</h1>
      </div>

      <form onSubmit={onSaveProfile} className="card flex flex-col gap-4">
        <h2 className="font-display font-semibold text-navy-900">Personal details</h2>
        {profileMsg.text && (
          <div className={`text-sm rounded-lg px-3 py-2 ${profileMsg.type === 'ok' ? 'text-ok bg-ok/10' : 'text-danger bg-danger/10'}`}>
            {profileMsg.text}
          </div>
        )}
        <div>
          <label className="label">Full name</label>
          <input className="input" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        </div>
        <button className="btn btn-primary self-start" disabled={savingProfile}>
          {savingProfile ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <form onSubmit={onChangePassword} className="card flex flex-col gap-4">
        <h2 className="font-display font-semibold text-navy-900">Change password</h2>
        {pwMsg.text && (
          <div className={`text-sm rounded-lg px-3 py-2 ${pwMsg.type === 'ok' ? 'text-ok bg-ok/10' : 'text-danger bg-danger/10'}`}>
            {pwMsg.text}
          </div>
        )}
        <div>
          <label className="label">Current password</label>
          <input required type="password" className="input" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} />
        </div>
        <div>
          <label className="label">New password</label>
          <input required type="password" className="input" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} />
        </div>
        <button className="btn btn-primary self-start" disabled={savingPw}>
          {savingPw ? 'Updating…' : 'Update password'}
        </button>
      </form>

      <div className="card flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-navy-900">Two-factor login</h2>
          <p className="text-sm text-slate-450 mt-1">Require an email code every time you log in.</p>
        </div>
        <button
          onClick={onToggle2FA}
          disabled={twoFaBusy}
          className={`btn ${user.otp_enabled ? 'btn-primary' : 'btn-outline'} !px-4 !py-2 text-sm`}
        >
          {user.otp_enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>
    </div>
  )
}
