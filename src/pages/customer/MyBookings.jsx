import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { myBookings, cancelBooking } from '../../api/bookings'
import { createRefundRequest } from '../../api/refunds'
import Loader from '../../components/Loader'
import { formatDate, money, statusBadgeClass, apiErrorMessage } from '../../utils/helpers'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    setLoading(true)
    myBookings()
      .then(({ data }) => setBookings(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onCancel = async (id) => {
    setBusyId(id)
    try {
      await cancelBooking(id)
      load()
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  const onRequestRefund = async (id) => {
    setBusyId(id)
    try {
      await createRefundRequest({ booking_id: id, reason: 'Customer requested refund' })
      alert('Refund requested. Our team will review it shortly.')
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  if (loading) return <Loader label="Loading your bookings" />

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <p className="eyebrow">Your trips</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">My bookings</h1>

      {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 mt-4">{error}</div>}

      {!bookings.length && (
        <div className="card mt-6 text-center text-slate-450">
          You haven't booked any flights yet.{' '}
          <Link to="/" className="text-navy-900 underline underline-offset-4">Search flights</Link>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-6">
        {bookings.map((b) => (
          <div key={b.id} className="ticket">
            <div className="ticket-main">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <p className="eyebrow">PNR</p>
                  <p className="pnr-code text-navy-900">{b.pnr}</p>
                </div>
                <span className={`badge ${statusBadgeClass(b.status)}`}>{b.status}</span>
              </div>
              <div className="mt-3 text-sm text-slate-450 flex flex-wrap gap-x-6 gap-y-1">
                <span>Passenger: <span className="text-navy-900">{b.passenger_name}</span></span>
                <span>Seats: <span className="text-navy-900">{b.seat_count}</span></span>
                <span>Booked: <span className="text-navy-900">{formatDate(b.created_at)}</span></span>
              </div>
            </div>
            <div className="ticket-stub">
              <div className="ticket-perf" />
              <div className="ticket-notch-top" />
              <div className="ticket-notch-bottom" />
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-white/60">Total</p>
                <p className="text-xl font-display font-bold text-amber-400">{money(b.total_price)}</p>
              </div>
              <div className="flex sm:flex-col gap-2 w-full">
                {b.status === 'pending' && (
                  <Link to={`/pay/${b.id}`} className="btn btn-amber !py-2 text-xs flex-1">Pay now</Link>
                )}
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <button
                    onClick={() => onCancel(b.id)}
                    disabled={busyId === b.id}
                    className="btn btn-outline !border-white/30 !text-white hover:!bg-white/10 !py-2 text-xs flex-1"
                  >
                    Cancel
                  </button>
                )}
                {b.status === 'confirmed' && (
                  <button
                    onClick={() => onRequestRefund(b.id)}
                    disabled={busyId === b.id}
                    className="btn btn-outline !border-white/30 !text-white hover:!bg-white/10 !py-2 text-xs flex-1"
                  >
                    Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
