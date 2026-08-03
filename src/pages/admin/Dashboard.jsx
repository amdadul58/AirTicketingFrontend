import { useEffect, useState } from 'react'
import { getSummary, getRecentBookings, getRevenueSeries } from '../../api/dashboard'
import Loader from '../../components/Loader'
import { formatDate, money, statusBadgeClass, apiErrorMessage } from '../../utils/helpers'
import { canChart, RevenueChart } from '../../components/ReportCharts'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])
  const [revenue, setRevenue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getSummary(), getRecentBookings(8), getRevenueSeries(30)])
      .then(([s, r, rev]) => {
        setSummary(s.data)
        setRecent(r.data)
        setRevenue(rev.data)
      })
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader label="Loading dashboard" />

  const summaryEntries = summary && typeof summary === 'object' ? Object.entries(summary) : []

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="eyebrow">Overview</p>
        <h1 className="text-3xl font-semibold text-navy-900 mt-2">Dashboard</h1>
      </div>

      {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}

      {summaryEntries.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryEntries.map(([key, value]) => (
            <div key={key} className="card">
              <p className="eyebrow">{key.replace(/_/g, ' ')}</p>
              <p className="text-2xl font-display font-semibold text-navy-900 mt-2">
                {typeof value === 'number' ? value.toLocaleString() : String(value)}
              </p>
            </div>
          ))}
        </div>
      )}

      {canChart(revenue) && (
        <div>
          <h2 className="font-display font-semibold text-navy-900 mb-3">Revenue (last 30 days)</h2>
          <div className="card !p-4">
            <RevenueChart data={revenue} />
          </div>
        </div>
      )}

      <div>
        <h2 className="font-display font-semibold text-navy-900 mb-3">Recent bookings</h2>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>PNR</th>
                <th>Passenger</th>
                <th>Seats</th>
                <th>Total</th>
                <th>Status</th>
                <th>Booked</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr key={b.id}>
                  <td className="font-mono">{b.pnr}</td>
                  <td>{b.passenger_name}</td>
                  <td>{b.seat_count}</td>
                  <td>{money(b.total_price)}</td>
                  <td><span className={`badge ${statusBadgeClass(b.status)}`}>{b.status}</span></td>
                  <td className="font-mono text-xs">{formatDate(b.created_at)}</td>
                </tr>
              ))}
              {!recent.length && (
                <tr><td colSpan={6} className="text-center text-slate-450 py-6">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
