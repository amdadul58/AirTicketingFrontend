import { Link } from 'react-router-dom'
import { formatDateTime, formatDuration } from '../utils/helpers'

export default function FlightCard({ flight }) {

  console.log("CARD FLIGHT:", flight)
  console.log(JSON.stringify(flight, null, 2))

  return (
    <div className="ticket">

      <h1 style={{ color: "black" }}>
        TEST {flight.flight_number}
      </h1>

      <div className="ticket-main">

        <div className="flex items-start justify-between gap-4 flex-wrap">

          <div>

            <p className="eyebrow">
              Flight {flight.flight_number}
            </p>

            <div className="mt-2 flex items-center gap-3">

              <div>

                <p className="text-2xl font-display font-semibold text-navy-900">
                  {flight.origin?.trim()}
                </p>

                <p className="text-xs text-slate-450 font-mono">
                  {formatDateTime(flight.departure_time)}
                </p>

              </div>

              <div className="flex flex-col items-center px-2 text-amber-500">

                <span className="text-xs font-mono">
                  {formatDuration(
                    flight.departure_time,
                    flight.arrival_time
                  )}
                </span>

                <div className="w-16 sm:w-24 h-px bg-navy-900/20 relative my-1">
                  <span className="absolute -right-1 -top-1 text-navy-900/40">
                    ›
                  </span>
                </div>

              </div>

              <div>

                <p className="text-2xl font-display font-semibold text-navy-900">
                  {flight.destination?.trim()}
                </p>

                <p className="text-xs text-slate-450 font-mono">
                  {formatDateTime(flight.arrival_time)}
                </p>

              </div>

            </div>

          </div>

          <div className="text-right">

            <p className="text-xs text-slate-450">
              Available seats
            </p>

            <p className="font-mono text-sm text-navy-900">
              {flight.available_seats ?? flight.total_seats ?? 0}
            </p>

          </div>

        </div>

      </div>

      <div className="ticket-stub">

        <div className="ticket-perf" />
        <div className="ticket-notch-top" />
        <div className="ticket-notch-bottom" />

        <div className="text-center">

          <p className="text-[10px] uppercase tracking-widest text-white/60">
            Fare
          </p>

          <p className="text-xl font-display font-bold text-amber-400">
            ${flight.price}
          </p>

        </div>

        <Link
          to={`/flights/${flight.id}`}
          className="btn btn-amber !px-4 !py-2 text-sm"
        >
          Select
        </Link>

      </div>

    </div>
  )
}