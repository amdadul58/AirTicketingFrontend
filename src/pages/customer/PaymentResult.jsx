import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { getPayment } from '../../api/payments'
import { apiErrorMessage, money, statusBadgeClass } from '../../utils/helpers'
import Loader from '../../components/Loader'

// bKash's Tokenized Checkout redirects the browser back to our site once the
// customer approves (or cancels) the payment on bKash's page. That redirect
// is issued by the *backend* (per the OpenAPI spec: bKash calls
// `/payments/bkash/callback` on the server, which should then send the
// customer's browser here).
//
// ASSUMPTION (flagged in the README until confirmed with the backend team):
// the backend redirects to  <FRONTEND_URL>/payment-result?payment_id=<id>
// We read `payment_id` (falling back to `id`) from the query string and just
// re-fetch the payment from the API — that's the source of truth, so this
// page works regardless of whatever extra query params bKash/the backend
// tack on (status, transactionId, etc.).
//
// If your backend redirects with a different param name or path, update the
// `paymentId` line below and/or the route in App.jsx to match.
const POLL_ATTEMPTS = 5
const POLL_INTERVAL_MS = 2000

export default function PaymentResult() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const paymentId = params.get('payment_id') || params.get('id')

  const [payment, setPayment] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!paymentId) {
      setError('No payment reference was provided in the redirect URL.')
      setLoading(false)
      return
    }

    let cancelled = false
    let attempt = 0

    const poll = async () => {
      try {
        const { data } = await getPayment(paymentId)
        if (cancelled) return
        setPayment(data)

        // bKash's own confirmation can land a beat after the redirect, so if
        // we're still "pending" / "requires_action" a few seconds in, check
        // again a few times before settling on whatever the last status was.
        attempt += 1
        if ((data.status === 'pending' || data.status === 'requires_action') && attempt < POLL_ATTEMPTS) {
          setTimeout(poll, POLL_INTERVAL_MS)
        } else {
          setLoading(false)
        }
      } catch (err) {
        if (cancelled) return
        setError(apiErrorMessage(err))
        setLoading(false)
      }
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [paymentId])

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <p className="eyebrow">Payment result</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">
        {loading ? 'Confirming your payment…' : 'Payment status'}
      </h1>

      {loading && <Loader label="Checking with bKash" />}

      {!loading && error && (
        <div className="card mt-6 flex flex-col gap-4">
          <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>
          <button onClick={() => navigate('/my-bookings')} className="btn btn-outline">
            Go to my bookings
          </button>
        </div>
      )}

      {!loading && payment && (
        <div className="card mt-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-450 text-sm">Amount</span>
            <span className="text-2xl font-display font-semibold text-navy-900">{money(payment.amount)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-450">Status</span>
            <span className={`badge ${statusBadgeClass(payment.status)}`}>{payment.status.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-450">Reference</span>
            <span className="font-mono text-navy-900">{payment.transaction_ref}</span>
          </div>

          {payment.status === 'success' && (
            <p className="text-sm text-ok">Your payment was successful — your booking is confirmed.</p>
          )}
          {(payment.status === 'pending' || payment.status === 'requires_action') && (
            <p className="text-sm text-slate-450 bg-navy-900/5 rounded-lg p-3">
              We haven't received final confirmation from bKash yet. This can take a few minutes — check your
              bookings shortly, or contact support if it doesn't update.
            </p>
          )}
          {payment.status === 'failed' && (
            <p className="text-sm text-danger">
              The payment wasn't completed.{' '}
              <Link to={`/pay/${payment.booking_id}`} className="underline">
                Try again
              </Link>
              .
            </p>
          )}

          <button onClick={() => navigate('/my-bookings')} className="btn btn-primary">
            View my bookings
          </button>
        </div>
      )}
    </div>
  )
}
