import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import EventCard from '../components/EventCard'
import { selectUserRegistrations } from '../features/registrations/registrationsSlice'
import { splitRegistrations } from '../utils/eventTime'

function Section({ title, registrations, emptyMessage }) {
  return (
    <section className="my-events-section" aria-labelledby={`${title}-heading`}>
      <h2 id={`${title}-heading`}>{title} ({registrations.length})</h2>
      {registrations.length === 0 ? (
        <p className="muted">{emptyMessage}</p>
      ) : (
        <div className="event-grid">
          {registrations.map((r) => <EventCard key={r.id} event={r.event} registeredAt={r.registeredAt} />)}
        </div>
      )}
    </section>
  )
}

export default function MyEvents() {
  const registrations = useSelector(selectUserRegistrations)
  const { upcoming, completed } = useMemo(() => splitRegistrations(registrations), [registrations])

  return (
    <section>
      <h1>My Events</h1>
      {registrations.length === 0 ? (
        <div className="status-message">
          <h2>You haven't registered for any events yet</h2>
          <Link className="btn" to="/events">Browse events</Link>
        </div>
      ) : (
        <>
          <Section title="Upcoming" registrations={upcoming} emptyMessage="No upcoming events. Browse events to register for one." />
          <Section title="Completed" registrations={completed} emptyMessage="No completed events yet." />
        </>
      )}
    </section>
  )
}
