import { useEffect, useState } from 'react'
import { listFlights, createFlight, updateFlight, deleteFlight } from '../../api/flights'
import { listAirlines } from '../../api/airlines'
import Pagination from '../../components/Pagination'
import Loader from '../../components/Loader'
import { Modal } from './Airlines'
import { formatDateTime, money, apiErrorMessage } from '../../utils/helpers'

const emptyForm = {
  flight_number: '', airline_id: '', origin: '', destination: '',
  departure_time: '', arrival_time: '', price: '', total_seats: '',
}

export default function Flights() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 20, total_pages: 1 })
  const [airlines, setAirlines] = useState([])
  const [filters, setFilters] = useState({ search: '', origin: '', destination: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = (page = 1) => {
    setLoading(true)
    listFlights({
      search: filters.search || undefined,
      origin: filters.origin || undefined,
      destination: filters.destination || undefined,
      page,
      page_size: 20,
      sort_by: 'departure_time',
    })
      .then(({ data }) => setData(data))
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(1)
    listAirlines({ page_size: 100 }).then(({ data }) => setAirlines(data.items)).catch(() => {})
  }, []) // eslint-disable-line

  const onFilterSubmit = (e) => { e.preventDefault(); load(1) }

  const openNew = () => { setForm(emptyForm); setEditing('new') }
  const openEdit = (f) => {
    setForm({
      flight_number: f.flight_number,
      airline_id: f.airline_id,
      origin: f.origin,
      destination: f.destination,
      departure_time: f.departure_time?.slice(0, 16) || '',
      arrival_time: f.arrival_time?.slice(0, 16) || '',
      price: f.price,
      total_seats: f.available_seats,
    })
    setEditing(f)
  }
  const closeModal = () => { setEditing(null); setError('') }

  const onSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      airline_id: Number(form.airline_id),
      price: Number(form.price),
      total_seats: Number(form.total_seats),
      departure_time: new Date(form.departure_time).toISOString(),
      arrival_time: new Date(form.arrival_time).toISOString(),
    }
    try {
      if (editing === 'new') await createFlight(payload)
      else await updateFlight(editing.id, payload)
      closeModal()
      load(data.page)
    } catch (err) {
      setError(apiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (f) => {
    if (!confirm(`Delete flight ${f.flight_number}?`)) return
    try {
      await deleteFlight(f.id)
      load(data.page)
    } catch (err) {
      alert(apiErrorMessage(err))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-start flex-wrap gap-3">
        <div>
          <p className="eyebrow">Route schedule</p>
          <h1 className="text-3xl font-semibold text-navy-900 mt-2">Flights</h1>
        </div>
        <button onClick={openNew} className="btn btn-primary">+ Add flight</button>
      </div>

      <form onSubmit={onFilterSubmit} className="mt-6 flex gap-2 flex-wrap">
        <input className="input max-w-[180px]" placeholder="Flight no." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        <input className="input max-w-[120px] font-mono uppercase" placeholder="From" value={filters.origin} onChange={(e) => setFilters({ ...filters, origin: e.target.value.toUpperCase() })} />
        <input className="input max-w-[120px] font-mono uppercase" placeholder="To" value={filters.destination} onChange={(e) => setFilters({ ...filters, destination: e.target.value.toUpperCase() })} />
        <button className="btn btn-outline">Filter</button>
      </form>

      {loading ? (
        <Loader label="Loading flights" />
      ) : (
        <>
          <div className="table-wrap mt-6">
            <table className="data">
              <thead>
                <tr><th>Flight</th><th>Route</th><th>Departs</th><th>Price</th><th>Seats</th><th></th></tr>
              </thead>
              <tbody>
                {data.items.map((f) => (
                  <tr key={f.id}>
                    <td className="font-mono">{f.flight_number}</td>
                    <td>{f.origin} → {f.destination}</td>
                    <td className="font-mono text-xs">{formatDateTime(f.departure_time)}</td>
                    <td>{money(f.price)}</td>
                    <td>{f.available_seats}</td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => openEdit(f)} className="btn btn-ghost !py-1 !px-2 text-xs">Edit</button>
                      <button onClick={() => onDelete(f)} className="btn btn-ghost !py-1 !px-2 text-xs text-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {!data.items.length && (
                  <tr><td colSpan={6} className="text-center text-slate-450 py-6">No flights found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={data.page} totalPages={data.total_pages} onChange={load} />
        </>
      )}

      {editing && (
        <Modal onClose={closeModal} title={editing === 'new' ? 'Add flight' : 'Edit flight'}>
          <form onSubmit={onSave} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
            {error && <div className="text-danger text-sm bg-danger/10 rounded-lg px-3 py-2">{error}</div>}
            <div>
              <label className="label">Flight number</label>
              <input required className="input font-mono" value={form.flight_number} onChange={(e) => setForm({ ...form, flight_number: e.target.value })} />
            </div>
            <div>
              <label className="label">Airline</label>
              <select required className="input" value={form.airline_id} onChange={(e) => setForm({ ...form, airline_id: e.target.value })}>
                <option value="">Select airline</option>
                {airlines.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.iata_code})</option>)}
              </select>
            </div>



                       <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="label">
                  Origin
                </label>

                <input
                  required
                  className="input"
                  placeholder="Dhaka / DAC"
                  value={form.origin}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      origin: e.target.value
                    })
                  }
                />
              </div>


              <div>
                <label className="label">
                  Destination
                </label>

                <input
                  required
                  className="input"
                  placeholder="Dubai / DXB"
                  value={form.destination}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      destination: e.target.value
                    })
                  }
                />
              </div>

            </div>
            


            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Departure</label>
                <input required type="datetime-local" className="input" value={form.departure_time} onChange={(e) => setForm({ ...form, departure_time: e.target.value })} />
              </div>
              <div>
                <label className="label">Arrival</label>
                <input required type="datetime-local" className="input" value={form.arrival_time} onChange={(e) => setForm({ ...form, arrival_time: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Price ($)</label>
                <input required type="number" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="label">Total seats</label>
                <input required type="number" className="input" value={form.total_seats} onChange={(e) => setForm({ ...form, total_seats: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={closeModal} className="btn btn-outline">Cancel</button>
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
