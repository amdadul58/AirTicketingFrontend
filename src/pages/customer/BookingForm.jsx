import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFlight } from '../../api/flights'
import { bookFlight } from '../../api/bookings'
import Loader from '../../components/Loader'
import { formatDateTime, money, apiErrorMessage } from '../../utils/helpers'

export default function BookingForm() {
  const { flightId } = useParams()
  const navigate = useNavigate()
  const [flight, setFlight] = useState(null)
  const [form, setForm] = useState({ passenger_name: '', passenger_passport: '', seat_count: 1 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getFlight(flightId)
      .then(({ data }) => setFlight(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [flightId])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data } = await bookFlight({ flight_id: Number(flightId), ...form, seat_count: Number(form.seat_count) })
      navigate(`/pay/${data.id}`)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Loader label="Preparing booking" />
  if (!flight) return <div className="max-w-xl mx-auto px-4 py-16 text-danger">{error}</div>

  const total = (flight.price * Number(form.seat_count || 1)).toFixed(2)

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <p className="eyebrow">Passenger details</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">
        {flight.origin} → {flight.destination}
      </h1>
      <p className="text-slate-450 text-sm mt-1">{formatDateTime(flight.departure_time)} · Flight {flight.flight_number}</p>

      <form onSubmit={onSubmit} className="card mt-6 flex flex-col gap-4">
        {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}
        <div>
          <label className="label">Passenger full name</label>
          <input
            required
            className="input"
            value={form.passenger_name}
            onChange={(e) => setForm({ ...form, passenger_name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Passport number (optional)</label>
          <input
            className="input"
            value={form.passenger_passport}
            onChange={(e) => setForm({ ...form, passenger_passport: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Seats</label>
          <input
            required
            type="number"
            min={1}
            max={flight.available_seats}
            className="input"
            value={form.seat_count}
            onChange={(e) => setForm({ ...form, seat_count: e.target.value })}
          />
        </div>

        <div className="border-t border-slate-450/10 pt-4 flex justify-between items-center">
          <span className="text-slate-450 text-sm">Total</span>
          <span className="text-2xl font-display font-semibold text-navy-900">{money(total)}</span>
        </div>

        <button className="btn btn-amber" disabled={submitting}>
          {submitting ? 'Booking…' : 'Confirm booking & continue to payment'}
        </button>
      </form>
    </div>
  )
}
