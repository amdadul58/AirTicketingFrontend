export function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDuration(startIso, endIso) {
  if (!startIso || !endIso) return ''
  const ms = new Date(endIso) - new Date(startIso)
  const h = Math.floor(ms / 3600000)
  const m = Math.round((ms % 3600000) / 60000)
  return `${h}h ${m}m`
}

export function money(n) {
  if (n === null || n === undefined) return '—'
  return `$${Number(n).toFixed(2)}`
}

export function statusBadgeClass(status) {
  const map = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    cancelled: 'badge-cancelled',
    completed: 'badge-completed',
    requested: 'badge-pending',
    approved: 'badge-confirmed',
    rejected: 'badge-cancelled',
    processed: 'badge-completed',
    success: 'badge-confirmed',
    failed: 'badge-cancelled',
    refunded: 'badge-completed',
    requires_action: 'badge-pending',
  }
  return map[status] || 'badge-pending'
}

export function apiErrorMessage(err) {
  const detail = err?.response?.data?.detail
  if (!detail) return err?.message || 'Something went wrong. Please try again.'
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map((d) => d.msg).join(', ')
  return 'Something went wrong. Please try again.'
}
