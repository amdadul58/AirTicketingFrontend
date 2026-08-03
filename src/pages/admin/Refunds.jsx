import { useEffect, useState } from 'react'
import { listRefunds, approveRefund, rejectRefund } from '../../api/refunds'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import { formatDate, money, statusBadgeClass, apiErrorMessage } from '../../utils/helpers'

export default function Refunds() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 20, total_pages: 1 })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = (page = 1) => {
    setLoading(true)
    listRefunds({ status: status || undefined, page, page_size: 20 })
      .then(({ data }) => setData(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(1) }, []) // eslint-disable-line

  const onApprove = async (id) => {
    setBusyId(id)
    try {
      await approveRefund(id)
      load(data.page)
    } catch (err) {
      alert(apiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const onReject = async (id) => {
    const reason = prompt('Reason for rejecting this refund (optional):') || ''
    setBusyId(id)
    try {
      await rejectRefund(id, reason)
      load(data.page)
    } catch (err) {
      alert(apiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <p className="eyebrow">Customer requests</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Refunds</h1>

      <div className="mt-6 flex gap-2">
        <select className="input max-w-[200px]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {['requested', 'approved', 'rejected', 'processed'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => load(1)} className="btn btn-outline">Filter</button>
      </div>

      {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 mt-4">{error}</div>}

      {loading ? (
        <Loader label="Loading refunds" />
      ) : (
        <>
          <div className="table-wrap mt-6">
            <table className="data">
              <thead>
                <tr><th>Booking</th><th>Amount</th><th>Reason</th><th>Status</th><th>Requested</th><th></th></tr>
              </thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r.id}>
                    <td>#{r.booking_id}</td>
                    <td>{money(r.amount)}</td>
                    <td className="max-w-[220px] truncate" title={r.reason || ''}>{r.reason || '—'}</td>
                    <td><span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span></td>
                    <td className="font-mono text-xs">{formatDate(r.requested_at)}</td>
                    <td className="text-right whitespace-nowrap">
                      {r.status === 'requested' && (
                        <>
                          <button disabled={busyId === r.id} onClick={() => onApprove(r.id)} className="btn btn-ghost !py-1 !px-2 text-xs text-ok">Approve</button>
                          <button disabled={busyId === r.id} onClick={() => onReject(r.id)} className="btn btn-ghost !py-1 !px-2 text-xs text-danger">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {!data.items.length && (
                  <tr><td colSpan={6} className="text-center text-slate-450 py-6">No refund requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} totalPages={data.total_pages} onChange={load} />
        </>
      )}
    </div>
  )
}
