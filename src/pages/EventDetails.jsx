import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import RegisterButton from '../components/RegisterButton'
import StatusMessage from '../components/StatusMessage'
import { fetchEventById } from '../features/events/eventsSlice'
import { formatDate, formatLocation, formatTime } from '../utils/format'

function DetailRow({ label, children }) {
  if (!children) return null
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export default function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedEvent: event, detailsStatus, detailsError, detailsNotFound } = useSelector(
    (state) => state.events,
  )

  useEffect(() => {
    dispatch(fetchEventById(id))
  }, [dispatch, id])

  // location.key is "default" when the page was opened directly (no history to go back to).
  const goBack = () => (location.key === 'default' ? navigate('/events') : navigate(-1))
  const backButton = (
    <button type="button" className="btn btn-outline back-btn" onClick={goBack}>
      ← Back
    </button>
  )

  if (detailsStatus === 'failed') {
    return (
      <section>
        {backButton}
        {detailsNotFound ? (
          <StatusMessage title="Event not found" message="This event does not exist or is no longer available." />
        ) : (
          <StatusMessage
            title="Something went wrong"
            message={detailsError}
            actionLabel="Retry"
            onAction={() => dispatch(fetchEventById(id))}
          />
        )}
      </section>
    )
  }

  if (!event || event.id !== id) {
    return (
      <section>
        {backButton}
        <div className="skeleton details-skeleton" aria-busy="true" aria-label="Loading event">
          <div className="event-card-image" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      </section>
    )
  }

  const time = formatTime(event.time)
  const address = formatLocation(event.address, event.city, event.state, event.country)

  return (
    <section>
      {backButton}
      <article className="card details">
        {event.largeImage && <img className="details-image" src={event.largeImage} alt={event.name} />}
        <div className="details-header">
          <h1>{event.name}</h1>
          {event.status && <span className={`badge status-${event.status}`}>{event.status}</span>}
        </div>
        <dl className="details-list">
          <DetailRow label="Date">{formatDate(event.date)}{time && ` · ${time}`}</DetailRow>
          <DetailRow label="Venue">{event.venueName}</DetailRow>
          <DetailRow label="Location">{address}</DetailRow>
          <DetailRow label="Category">{[event.category, event.genre].filter(Boolean).join(' / ')}</DetailRow>
          <DetailRow label="Price">{event.priceRange}</DetailRow>
          <DetailRow label="Info">{event.info}</DetailRow>
          <DetailRow label="Please note">{event.pleaseNote}</DetailRow>
        </dl>
        {event.url && (
          <a className="btn details-link" href={event.url} target="_blank" rel="noopener noreferrer">
            Official Ticketmaster page
          </a>
        )}
        <div id="registration-slot">
          <RegisterButton event={event} />
        </div>
      </article>
    </section>
  )
}

