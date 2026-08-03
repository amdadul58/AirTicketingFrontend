import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-amber-500'
        : 'text-white/80 hover:text-white'
    }`

  return (
    <header className="bg-navy-900 sticky top-0 z-40">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="text-amber-500 text-xl">✈</span>
          <span className="font-display font-semibold tracking-tight text-lg">
            SkyDesk
          </span>
        </Link>


        <div className="hidden md:flex items-center gap-6">

          <NavLink to="/" end className={linkClass}>
            Search
          </NavLink>


          {user && (
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          )}


          {user && (
            <NavLink to="/my-bookings" className={linkClass}>
              My Bookings
            </NavLink>
          )}


          {user && (
            <NavLink to="/notifications" className={linkClass}>
              Notifications
            </NavLink>
          )}


          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}

        </div>



        <div className="flex items-center gap-3">

          {user ? (
            <>
              <NavLink
                to="/profile"
                className="hidden sm:block text-sm text-white/80 hover:text-white"
              >
                {user.full_name}
              </NavLink>


              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                className="btn btn-outline !text-white !border-white/30 hover:!bg-white/10 !py-1.5 !px-3 text-xs"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-white/80 hover:text-white"
              >
                Log in
              </Link>


              <Link
                to="/register"
                className="btn btn-amber !py-1.5 !px-3 text-xs"
              >
                Sign up
              </Link>
            </>
          )}

        </div>

      </nav>
    </header>
  )
}