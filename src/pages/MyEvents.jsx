import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import EventCard from '../components/EventCard'
import { selectUserRegistrations } from '../features/registrations/registrationsSlice'

export default function MyEvents() {
  const registrations = useSelector(selectUserRegistrations)

  return (
    <section>
      <h1>My Events</h1>
      {registrations.length === 0 ? (
        <div className="status-message">
          <h2>You haven't registered for any events yet</h2>
          <Link className="btn" to="/events">Browse events</Link>
        </div>
      ) : (
        <div className="event-grid">
          {registrations.map((r) => <EventCard key={r.id} event={r.event} registeredAt={r.registeredAt} />)}
        </div>
      )}
    </section>
  )
}
