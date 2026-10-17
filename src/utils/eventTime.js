// Start of an event as a Date: the exact dateTime when known, otherwise the
// local date (+ local time if any, else end of that day). Null if unknown.
export function getEventStart(event) {
  if (event.dateTime) {
    const d = new Date(event.dateTime)
    if (!Number.isNaN(d.getTime())) return d
  }
  if (event.date) {
    const [y, m, d] = event.date.split('-').map(Number)
    if (!y || !m || !d) return null
    const [h, min] = event.time ? event.time.split(':').map(Number) : [23, 59]
    return new Date(y, m - 1, d, h || 0, min || 0)
  }
  return null
}

// Events with no known date are never treated as past.
export function isPastEvent(event, now = Date.now()) {
  const start = getEventStart(event)
  return start !== null && start.getTime() < now
}

const startTime = (r) => getEventStart(r.event)?.getTime() ?? Infinity

// Upcoming: soonest first. Completed: most recent first.
export function splitRegistrations(registrations, now = Date.now()) {
  const upcoming = []
  const completed = []
  registrations.forEach((r) => (isPastEvent(r.event, now) ? completed : upcoming).push(r))
  upcoming.sort((a, b) => startTime(a) - startTime(b))
  completed.sort((a, b) => startTime(b) - startTime(a))
  return { upcoming, completed }
}
