import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getFlight } from '../../api/flights'
import { getAirline } from '../../api/airlines'
import Loader from '../../components/Loader'
import { formatDateTime, formatDuration, apiErrorMessage } from '../../utils/helpers'

export default function FlightDetails() {
  const { id } = useParams()
  const [flight, setFlight] = useState(null)
  const [airline, setAirline] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getFlight(id)
      .then(({ data }) => {
        setFlight(data)
        return getAirline(data.airline_id).then(({ data: a }) => setAirline(a))
      })
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loader label="Loading flight" />
  if (error) return <div className="max-w-2xl mx-auto px-4 py-16 text-danger">{error}</div>
  if (!flight) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <p className="eyebrow">Flight details</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">
        {flight.origin} → {flight.destination}
      </h1>
      {airline && <p className="text-slate-450 mt-1">{airline.name} · {airline.iata_code}</p>}

      <div className="ticket mt-6">
        <div className="ticket-main flex flex-col gap-4">
          <div className="flex justify-between">
            <div>
              <p className="text-xs text-slate-450">Departs</p>
              <p className="font-mono text-navy-900">{formatDateTime(flight.departure_time)}</p>
              <p className="text-2xl font-display font-semibold">{flight.origin}</p>
            </div>
            <div className="text-center self-center">
              <p className="text-xs font-mono text-amber-500">{formatDuration(flight.departure_time, flight.arrival_time)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-450">Arrives</p>
              <p className="font-mono text-navy-900">{formatDateTime(flight.arrival_time)}</p>
              <p className="text-2xl font-display font-semibold">{flight.destination}</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-slate-450 border-t border-slate-450/10 pt-4">
            <div>
              <p className="text-xs uppercase tracking-wide">Flight no.</p>
              <p className="font-mono text-navy-900">{flight.flight_number}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide">Seats left</p>
              <p className="font-mono text-navy-900">{flight.available_seats}</p>
            </div>
          </div>
        </div>
        <div className="ticket-stub">
          <div className="ticket-perf" />
          <div className="ticket-notch-top" />
          <div className="ticket-notch-bottom" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-white/60">Fare from</p>
            <p className="text-2xl font-display font-bold text-amber-400">${flight.price}</p>
          </div>
          <Link
            to={flight.available_seats > 0 ? `/book/${flight.id}` : '#'}
            className={`btn ${flight.available_seats > 0 ? 'btn-amber' : 'btn-outline pointer-events-none opacity-50'} !px-5 !py-2.5 text-sm`}
          >
            {flight.available_seats > 0 ? 'Book this flight' : 'Sold out'}
          </Link>
        </div>
      </div>
    </div>
  )
}
