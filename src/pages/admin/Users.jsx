import { useEffect, useState } from 'react'
import { listUsers, updateUser, deleteUser } from '../../api/users'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import { Modal } from './Airlines'
import { formatDate, apiErrorMessage } from '../../utils/helpers'

export default function Users() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 20, total_pages: 1 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ full_name: '', is_active: true, is_verified: true, role_name: '' })
  const [saving, setSaving] = useState(false)

  const load = (page = 1) => {
    setLoading(true)
    listUsers({ search: search || undefined, page, page_size: 20, sort_by: 'created_at' })
      .then(({ data }) => setData(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(1) }, []) // eslint-disable-line

  const onSearchSubmit = (e) => { e.preventDefault(); load(1) }

  const openEdit = (u) => {
    setForm({ full_name: u.full_name, is_active: u.is_active, is_verified: u.is_verified, role_name: u.role_name || '' })
    setEditing(u)
  }
  const closeModal = () => { setEditing(null); setError('') }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await updateUser(editing.id, form)
      closeModal()
      load(data.page)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (u) => {
    if (!confirm(`Delete user "${u.full_name}"?`)) return
    try {
      await deleteUser(u.id)
      load(data.page)
    } catch (err) {
      alert(apiErrorMessage(err))
    }
  }

  return (
    <div>
      <p className="eyebrow">Accounts</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Users</h1>

      <form onSubmit={onSearchSubmit} className="mt-6 flex gap-2 max-w-sm">
        <input className="input" placeholder="Search by name, email, phone" value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-outline">Search</button>
      </form>

      {loading ? (
        <Loader label="Loading users" />
      ) : (
        <>
          <div className="table-wrap mt-6">
            <table className="data">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th></th></tr>
              </thead>
              <tbody>
                {data.items.map((u) => (
                  <tr key={u.id}>
                    <td>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.role_name || '—'}</td>
                    <td>
                      <span className={`badge ${u.is_active ? 'badge-confirmed' : 'badge-cancelled'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="font-mono text-xs">{formatDate(u.created_at)}</td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => openEdit(u)} className="btn btn-ghost !py-1 !px-2 text-xs">Edit</button>
                      <button onClick={() => onDelete(u)} className="btn btn-ghost !py-1 !px-2 text-xs text-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {!data.items.length && (
                  <tr><td colSpan={6} className="text-center text-slate-450 py-6">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} totalPages={data.total_pages} onChange={load} />
        </>
      )}

      {editing && (
        <Modal onClose={closeModal} title={`Edit ${editing.full_name}`}>
          <form onSubmit={onSave} className="flex flex-col gap-4">
            {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}
            <div>
              <label className="label">Full name</label>
              <input className="input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Role name</label>
              <input className="input" placeholder="e.g. customer, staff, admin" value={form.role_name} onChange={(e) => setForm({ ...form, role_name: e.target.value })} />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_verified} onChange={(e) => setForm({ ...form, is_verified: e.target.checked })} />
                Verified
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={closeModal} className="btn btn-outline">Cancel</button>
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
