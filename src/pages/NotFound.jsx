import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="card narrow center">
      <h1>404</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/events">Go to events</Link>
    </div>
  )
}

