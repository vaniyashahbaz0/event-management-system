import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsRegistered } from '../features/registrations/registrationsSlice'
import { formatDate, formatLocation, formatTime } from '../utils/format'

export default function EventCard({ event }) {
  const registered = useSelector((state) => selectIsRegistered(state, event.id))
  const time = formatTime(event.time)
  const location = formatLocation(event.venueName, event.city)

  return (
    <article className="event-card">
      {event.image ? (
        <img className="event-card-image" src={event.image} alt={event.name} loading="lazy" />
      ) : (
        <div className="event-card-image event-card-placeholder">No image</div>
      )}
      <div className="event-card-body">
        <div className="badge-row">
          {event.category && <span className="badge">{event.category}</span>}
          {registered && <span className="badge badge-success">Registered</span>}
        </div>
        <h2 className="event-card-title">{event.name}</h2>
        <p className="event-card-meta">
          {formatDate(event.date)}
          {time && ` · ${time}`}
        </p>
        {location && <p className="event-card-meta">{location}</p>}
        <Link className="btn btn-outline event-card-link" to={`/events/${event.id}`}>
          View details
        </Link>
      </div>
    </article>
  )
}
