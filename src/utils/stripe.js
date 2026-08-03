import { loadStripe } from '@stripe/stripe-js'

const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// loadStripe() memoizes internally, but we still only want to call it once
// and only if a key is actually configured — calling it with an empty
// string throws.
export const stripePromise = key ? loadStripe(key) : null
export const stripeConfigured = Boolean(key)
