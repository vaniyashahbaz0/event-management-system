import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../features/auth/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)

  return (
    <header className="navbar">
      <Link to="/events" className="navbar-brand">Event Manager</Link>
      <nav className="navbar-links">
        {user ? (
          <>
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
