import { useState } from 'react'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise, stripeConfigured } from '../utils/stripe'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      fontFamily: '"Inter", system-ui, sans-serif',
      color: '#1C2733',
      '::placeholder': { color: '#5B6B7C99' },
    },
    invalid: { color: '#C1443C' },
  },
}

/**
 * Renders Stripe's card element and confirms the PaymentIntent client-side
 * (covers 3D-Secure / SCA automatically). Call onSuccess(paymentIntent) once
 * Stripe reports the intent has succeeded — the parent should still re-fetch
 * the payment from the backend afterwards, since that's the source of truth
 * for `status`.
 */
function InnerForm({ clientSecret, amountLabel, onSuccess, onError }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [cardError, setCardError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setSubmitting(true)
    setCardError('')

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    })

    setSubmitting(false)

    if (error) {
      setCardError(error.message || 'Your card was declined.')
      onError?.(error.message || 'Your card was declined.')
      return
    }

    if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
      onSuccess?.(paymentIntent)
    } else {
      setCardError('Payment could not be confirmed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="label">Card details</label>
        <div className="input !py-3">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>
      {cardError && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{cardError}</div>}
      <button type="submit" className="btn btn-amber" disabled={!stripe || submitting}>
        {submitting ? 'Confirming…' : `Pay ${amountLabel}`}
      </button>
      <p className="text-xs text-slate-450 text-center">Payments are processed securely by Stripe.</p>
    </form>
  )
}

export default function CardPaymentForm(props) {
  if (!stripeConfigured) {
    return (
      <div className="text-sm text-slate-450 bg-navy-900/5 rounded-lg p-3">
        Card payments aren't configured yet — set <code className="font-mono">VITE_STRIPE_PUBLISHABLE_KEY</code> in
        your <code className="font-mono">.env</code> file to enable the real card form.
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <InnerForm {...props} />
    </Elements>
  )
}
