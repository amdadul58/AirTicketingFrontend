import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/airlines', label: 'Airlines' },
  { to: '/admin/flights', label: 'Flights' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/payments', label: 'Payments' },
  { to: '/admin/refunds', label: 'Refunds' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/audit-logs', label: 'Audit logs' },
]

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid md:grid-cols-[200px_1fr] gap-8">
      <aside className="md:sticky md:top-20 h-fit">
        <p className="eyebrow mb-3">Control desk</p>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-navy-900 text-white' : 'text-navy-900/70 hover:bg-navy-900/5'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
