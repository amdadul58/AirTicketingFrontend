import { useEffect, useState } from 'react'
import { listPayments } from '../../api/payments'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import { formatDateTime, money, statusBadgeClass, apiErrorMessage } from '../../utils/helpers'

export default function Payments() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 20, total_pages: 1 })
  const [filters, setFilters] = useState({ status: '', method: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = (page = 1) => {
    setLoading(true)
    listPayments({ status: filters.status || undefined, method: filters.method || undefined, page, page_size: 20 })
      .then(({ data }) => setData(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(1) }, []) // eslint-disable-line

  return (
    <div>
      <p className="eyebrow">Transactions</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Payments</h1>

      <div className="mt-6 flex gap-2 flex-wrap">
        <select className="input max-w-[180px]" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          {['pending', 'requires_action', 'success', 'failed', 'refunded'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input max-w-[180px]" value={filters.method} onChange={(e) => setFilters({ ...filters, method: e.target.value })}>
          <option value="">All methods</option>
          {['card', 'mobile_banking', 'bank_transfer'].map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <button onClick={() => load(1)} className="btn btn-outline">Filter</button>
      </div>

      {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 mt-4">{error}</div>}

      {loading ? (
        <Loader label="Loading payments" />
      ) : (
        <>
          <div className="table-wrap mt-6">
            <table className="data">
              <thead>
                <tr><th>Ref</th><th>Booking</th><th>Amount</th><th>Method</th><th>Gateway</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {data.items.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.transaction_ref}</td>
                    <td>#{p.booking_id}</td>
                    <td>{money(p.amount)}</td>
                    <td>{p.method}</td>
                    <td>{p.gateway}</td>
                    <td><span className={`badge ${statusBadgeClass(p.status)}`}>{p.status}</span></td>
                    <td className="font-mono text-xs">{formatDateTime(p.created_at)}</td>
                  </tr>
                ))}
                {!data.items.length && (
                  <tr><td colSpan={7} className="text-center text-slate-450 py-6">No payments found.</td></tr>
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
