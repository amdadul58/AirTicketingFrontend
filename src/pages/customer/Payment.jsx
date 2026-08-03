import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { payForBooking, confirmTestCardPayment, getPayment } from '../../api/payments'
import { apiErrorMessage, money, statusBadgeClass } from '../../utils/helpers'
import CardPaymentForm from '../../components/CardPaymentForm'

const METHODS = [
  { value: 'card', label: 'Credit / debit card' },
  { value: 'mobile_banking', label: 'Mobile banking (bKash)' },
  { value: 'bank_transfer', label: 'Bank transfer' },
]

export default function Payment() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [method, setMethod] = useState('card')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [payment, setPayment] = useState(null)

  const onPay = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { booking_id: Number(bookingId), method }
      if (method === 'mobile_banking') payload.provider = 'bkash'
      const { data } = await payForBooking(payload)
      setPayment(data)

      if (data.method === 'mobile_banking' && data.client_secret) {
        // bKash tokenized checkout — send the customer to bKash's approval page
        window.location.href = data.client_secret
      }
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const confirmWithTestCard = async () => {
    setError('')
    setLoading(true)
    try {
      const { data } = await confirmTestCardPayment(payment.id, 'pm_card_visa')
      setPayment(data)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <p className="eyebrow">Step 2 of 2</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Pay for your booking</h1>

      {!payment && (
        <form onSubmit={onPay} className="card mt-6 flex flex-col gap-4">
          {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}
          <p className="label !mb-2">Choose a payment method</p>
          <div className="flex flex-col gap-2">
            {METHODS.map((m) => (
              <label
                key={m.value}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition ${
                  method === m.value ? 'border-amber-500 bg-amber-300/10' : 'border-slate-450/20'
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.value}
                  checked={method === m.value}
                  onChange={(e) => setMethod(e.target.value)}
                />
                <span className="text-sm text-navy-900">{m.label}</span>
              </label>
            ))}
          </div>
          <button className="btn btn-amber" disabled={loading}>
            {loading ? 'Processing…' : 'Pay now'}
          </button>
        </form>
      )}

      {payment && (
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
            <button onClick={() => navigate('/my-bookings')} className="btn btn-primary">
              View my bookings
            </button>
          )}

          {payment.status === 'requires_action' && payment.method === 'card' && payment.client_secret && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-450">
                Your bank requires additional verification (3D-Secure) to complete this payment.
              </p>
              <CardPaymentForm
                clientSecret={payment.client_secret}
                amountLabel={money(payment.amount)}
                onError={(msg) => setError(msg)}
                onSuccess={async () => {
                  try {
                    const { data } = await getPayment(payment.id)
                    setPayment(data)
                  } catch (err) {
                    setError(apiErrorMessage(err))
                  }
                }}
              />
              {import.meta.env.DEV && (
                <button onClick={confirmWithTestCard} className="btn btn-ghost text-xs" disabled={loading}>
                  {loading ? 'Confirming…' : 'Dev only: skip Stripe.js and confirm with test card'}
                </button>
              )}
            </div>
          )}

          {payment.status === 'pending' && payment.method !== 'mobile_banking' && (
            <p className="text-sm text-slate-450 bg-navy-900/5 rounded-lg p-3">
              Your payment has been recorded and is pending manual verification by our staff.
              We'll notify you once it's confirmed.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
