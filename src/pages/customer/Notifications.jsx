import { useEffect, useState } from 'react'
import { myNotifications, markAsRead, deleteNotification } from '../../api/notifications'
import Loader from '../../components/Loader'
import { formatDateTime, apiErrorMessage } from '../../utils/helpers'

export default function Notifications() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    myNotifications()
      .then(({ data }) => setItems(Array.isArray(data) ? data : data?.items || []))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const onRead = async (id) => {
    try {
      await markAsRead(id)
      load()
    } catch {
      /* silent */
    }
  }

  const onDelete = async (id) => {
    try {
      await deleteNotification(id)
      load()
    } catch {
      /* silent */
    }
  }

  if (loading) return <Loader label="Loading notifications" />

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <p className="eyebrow">Inbox</p>
      <h1 className="text-3xl font-semibold text-navy-900 mt-2">Notifications</h1>

      {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2 mt-4">{error}</div>}
      {!items.length && !error && <div className="card mt-6 text-center text-slate-450">Nothing here yet.</div>}

      <div className="flex flex-col gap-3 mt-6">
        {items.map((n) => (
          <div key={n.id} className={`card flex justify-between items-start gap-3 ${n.is_read ? 'opacity-60' : ''}`}>
            <div>
              <p className="text-sm text-navy-900 font-medium">{n.title || n.subject || 'Notification'}</p>
              <p className="text-sm text-slate-450 mt-1">{n.message || n.body || ''}</p>
              {n.created_at && <p className="text-xs text-slate-450/70 font-mono mt-2">{formatDateTime(n.created_at)}</p>}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              {!n.is_read && (
                <button onClick={() => onRead(n.id)} className="btn btn-ghost !py-1 !px-2 text-xs">Mark read</button>
              )}
              <button onClick={() => onDelete(n.id)} className="btn btn-ghost !py-1 !px-2 text-xs text-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
