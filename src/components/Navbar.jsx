import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { selectUserRegistrations } from '../features/registrations/registrationsSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const registrationCount = useSelector((state) => selectUserRegistrations(state).length)

  return (
    <header className="navbar">
      <Link to="/events" className="navbar-brand">Event Manager</Link>
      <nav className="navbar-links">
        {user ? (
          <>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/my-events" className="nav-my-events">
              My Events
              {registrationCount > 0 && (
                <span className="count-badge" aria-label={`${registrationCount} registered`}>{registrationCount}</span>
              )}
            </NavLink>
            <span>Hi, {user.name}</span>
            <button type="button" className="btn btn-outline" onClick={() => dispatch(logout())}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}
