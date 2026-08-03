import { useEffect, useState } from 'react'
import { listAirlines, createAirline, updateAirline, deleteAirline } from '../../api/airlines'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import { apiErrorMessage } from '../../utils/helpers'

const emptyForm = { name: '', iata_code: '', country: '' }

export default function Airlines() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 20, total_pages: 1 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | airline object
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = (page = 1) => {
    setLoading(true)
    listAirlines({ search: search || undefined, page, page_size: 20 })
      .then(({ data }) => setData(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(1) }, []) // eslint-disable-line

  const onSearchSubmit = (e) => { e.preventDefault(); load(1) }

  const openNew = () => { setForm(emptyForm); setEditing('new') }
  const openEdit = (a) => { setForm({ name: a.name, iata_code: a.iata_code, country: a.country || '' }); setEditing(a) }
  const closeModal = () => { setEditing(null); setError('') }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing === 'new') await createAirline(form)
      else await updateAirline(editing.id, form)
      closeModal()
      load(data.page)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (a) => {
    if (!confirm(`Delete airline "${a.name}"?`)) return
    try {
      await deleteAirline(a.id)
      load(data.page)
    } catch (err) {
      alert(apiErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <p className="eyebrow">Fleet operators</p>
          <h1 className="text-3xl font-semibold text-navy-900 mt-2">Airlines</h1>
        </div>
        <button onClick={openNew} className="btn btn-primary">+ Add airline</button>
      </div>

      <form onSubmit={onSearchSubmit} className="mt-6 flex gap-2 max-w-sm">
        <input
          className="input"
          placeholder="Search by name or IATA code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline">Search</button>
      </form>

      {loading ? (
        <Loader label="Loading airlines" />
      ) : (
        <>
          <div className="table-wrap mt-6">
            <table className="data">
              <thead>
                <tr><th>Name</th><th>IATA</th><th>Country</th><th></th></tr>
              </thead>
              <tbody>
                {data.items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td className="font-mono">{a.iata_code}</td>
                    <td>{a.country || '—'}</td>
                    <td className="text-right">
                      <button onClick={() => openEdit(a)} className="btn btn-ghost !py-1 !px-2 text-xs">Edit</button>
                      <button onClick={() => onDelete(a)} className="btn btn-ghost !py-1 !px-2 text-xs text-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {!data.items.length && (
                  <tr><td colSpan={4} className="text-center text-slate-450 py-6">No airlines found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} totalPages={data.total_pages} onChange={load} />
        </>
      )}

      {editing && (
        <Modal onClose={closeModal} title={editing === 'new' ? 'Add airline' : 'Edit airline'}>
          <form onSubmit={onSave} className="flex flex-col gap-4">
            {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}
            <div>
              <label className="label">Name</label>
              <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">IATA code</label>
              <input
                required
                maxLength={3}
                className="input font-mono uppercase"
                value={form.iata_code}
                onChange={(e) => setForm({ ...form, iata_code: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="label">Country</label>
              <input className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
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

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-navy-950/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-ticket p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-semibold text-lg text-navy-900">{title}</h3>
          <button onClick={onClose} className="text-slate-450 hover:text-navy-900">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
