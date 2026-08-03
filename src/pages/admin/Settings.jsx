import { useEffect, useState } from 'react'
import { listSettings, updateSetting, deleteSetting } from '../../api/settings'
import Loader from '../../components/Loader'
import { apiErrorMessage } from '../../utils/helpers'

export default function Settings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ key: '', value: '' })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    listSettings()
      .then(({ data }) => setItems(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateSetting(form.key, form.value)
      setForm({ key: '', value: '' })
      load()
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const onEditRow = (key, value) => setForm({ key, value })

  const onDelete = async (key) => {
    if (!confirm(`Delete setting "${key}"?`)) return
    try {
      await deleteSetting(key)
      load()
    } catch (err) {
      alert(apiErrorMessage(err))
    }
  }

  if (loading) return <Loader label="Loading settings" />

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow">System configuration</p>
        <h1 className="text-3xl font-semibold text-navy-900 mt-2">Settings</h1>
      </div>

      <form onSubmit={onSave} className="card flex flex-col sm:flex-row gap-3 sm:items-end">
        {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 sm:w-full">{error}</div>}
        <div className="flex-1">
          <label className="label">Key</label>
          <input required className="input font-mono" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} />
        </div>
        <div className="flex-1">
          <label className="label">Value</label>
          <input required className="input" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
        </div>
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save setting'}</button>
      </form>

      <div className="table-wrap">
        <table className="data">
          <thead><tr><th>Key</th><th>Value</th><th></th></tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.key}>
                <td className="font-mono">{s.key}</td>
                <td>{s.value}</td>
                <td className="text-right whitespace-nowrap">
                  <button onClick={() => onEditRow(s.key, s.value)} className="btn btn-ghost !py-1 !px-2 text-xs">Edit</button>
                  <button onClick={() => onDelete(s.key)} className="btn btn-ghost !py-1 !px-2 text-xs text-danger">Delete</button>
                </td>
              </tr>
            ))}
            {!items.length && <tr><td colSpan={3} className="text-center text-slate-450 py-6">No settings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
