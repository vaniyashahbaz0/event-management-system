const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// localDate is "YYYY-MM-DD"; parsed manually to avoid timezone shifts.
export function formatDate(localDate) {
  if (!localDate) return 'Date to be announced'
  const [y, m, d] = localDate.split('-').map(Number)
  const day = DAYS[new Date(y, m - 1, d).getDay()]
  return `${day}, ${MONTHS[m - 1]} ${d}, ${y}`
}

// localTime is "HH:mm:ss".
export function formatTime(localTime) {
  if (!localTime) return null
  const [h, min] = localTime.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(min).padStart(2, '0')} ${suffix}`
}

export function formatLocation(...parts) {
  return parts.filter(Boolean).join(', ')
}
