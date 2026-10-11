import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}
