import { useEffect, useState } from 'react'
import { listAuditLogs, deleteAuditLog } from '../../api/auditLogs'
import Loader from '../../components/Loader'
import { formatDateTime, apiErrorMessage } from '../../utils/helpers'

export default function AuditLogs() {
  const [items, setItems] = useState([])
  const [limit, setLimit] = useState(50)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    listAuditLogs(limit)
      .then(({ data }) => setItems(Array.isArray(data) ? data : data?.items || []))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, []) // eslint-disable-line

  const onDelete = async (id) => {
    if (!confirm('Delete this log entry?')) return
    try {
      await deleteAuditLog(id)
      load()
    } catch (err) {
      alert(apiErrorMessage(err))
    }
  }

  return (
    <div>
      <p className="eyebrow">Trail</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Audit logs</h1>

      <div className="mt-6 flex gap-2 items-end">
        <div>
          <label className="label">Limit</label>
          <input type="number" className="input max-w-[120px]" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
        </div>
        <button onClick={load} className="btn btn-outline">Refresh</button>
      </div>

      {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 mt-4">{error}</div>}

      {loading ? (
        <Loader label="Loading logs" />
      ) : (
        <div className="table-wrap mt-6">
          <table className="data">
            <thead><tr><th>ID</th><th>Actor</th><th>Action</th><th>Target</th><th>When</th><th></th></tr></thead>
            <tbody>
              {items.map((l) => (
                <tr key={l.id}>
                  <td className="font-mono text-xs">{l.id}</td>
                  <td>{l.user_id ?? l.actor ?? '—'}</td>
                  <td>{l.action ?? '—'}</td>
                  <td>{l.entity ?? l.target ?? '—'}</td>
                  <td className="font-mono text-xs">{l.created_at ? formatDateTime(l.created_at) : '—'}</td>
                  <td className="text-right">
                    <button onClick={() => onDelete(l.id)} className="btn btn-ghost !py-1 !px-2 text-xs text-danger">Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={6} className="text-center text-slate-450 py-6">No log entries.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
