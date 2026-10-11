export default function EventCardSkeleton() {
  return (
    <div className="event-card skeleton" aria-hidden="true">
      <div className="event-card-image" />
      <div className="event-card-body">
        <div className="skeleton-line short" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    </div>
  )
}
