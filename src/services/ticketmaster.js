const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'

export const PAGE_SIZE = 12
// Ticketmaster rejects requests where size * page >= 1000.
const MAX_RESULT_WINDOW = 1000

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const STATUS_MESSAGES = {
  401: 'Invalid or missing Ticketmaster API key.',
  404: 'Event not found.',
  429: 'Too many requests. Please wait a moment and try again.',
}

async function request(path, params = {}, signal) {
  const query = new URLSearchParams({ apikey: import.meta.env.VITE_TM_API_KEY ?? '' })
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) query.set(key, value)
  })

  let response
  try {
    response = await fetch(`${BASE_URL}${path}?${query}`, { signal })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiError('Network error. Check your connection and try again.', 0)
  }

  if (!response.ok) {
    const message =
      STATUS_MESSAGES[response.status] ??
      `Ticketmaster request failed (status ${response.status}).`
    throw new ApiError(message, response.status)
  }
  return response.json()
}

function pickImage(images = [], minWidth) {
  const wide = images.filter((img) => img.ratio === '16_9' && img.width >= minWidth)
  const pool = wide.length ? wide : images
  if (!pool.length) return null
  // Smallest image that satisfies the width keeps downloads light.
  return [...pool].sort((a, b) => a.width - b.width)[0].url
}

function formatPrice(priceRanges) {
  const range = priceRanges?.[0]
  if (!range) return null
  const { currency, min, max } = range
  return min === max ? `${currency} ${min}` : `${currency} ${min} - ${max}`
}

export function normalizeEvent(raw) {
  const venue = raw._embedded?.venues?.[0]
  const classification = raw.classifications?.[0]
  return {
    id: raw.id,
    name: raw.name,
    image: pickImage(raw.images, 640),
    largeImage: pickImage(raw.images, 1024),
    date: raw.dates?.start?.localDate ?? null,
    time: raw.dates?.start?.localTime ?? null,
    dateTime: raw.dates?.start?.dateTime ?? null,
    venueName: venue?.name ?? null,
    address: venue?.address?.line1 ?? null,
    city: venue?.city?.name ?? null,
    state: venue?.state?.name ?? null,
    country: venue?.country?.name ?? null,
    category: classification?.segment?.name ?? null,
    genre: classification?.genre?.name ?? null,
    url: raw.url ?? null,
    priceRange: formatPrice(raw.priceRanges),
    status: raw.dates?.status?.code ?? null,
    info: raw.info ?? null,
    pleaseNote: raw.pleaseNote ?? null,
  }
}

const toApiDate = (date, endOfDay) => `${date}T${endOfDay ? '23:59:59' : '00:00:00'}Z`
const toApiNow = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')

export function buildEventParams(filters, page) {
  const { keyword, category, city, dateFrom, dateTo, upcoming } = filters
  let startDateTime = dateFrom ? toApiDate(dateFrom, false) : ''
  if (upcoming) {
    const now = toApiNow()
    if (!startDateTime || startDateTime < now) startDateTime = now
  }
  return {
    keyword: keyword.trim(),
    classificationName: category,
    city: city.trim(),
    startDateTime,
    endDateTime: dateTo ? toApiDate(dateTo, true) : '',
    sort: upcoming ? 'date,asc' : '',
    size: PAGE_SIZE,
    page,
  }
}

export async function getEvents(filters, page, signal) {
  const data = await request('/events.json', buildEventParams(filters, page), signal)
  const { totalElements = 0, totalPages = 0, number = 0, size = PAGE_SIZE } = data.page ?? {}
  return {
    events: (data._embedded?.events ?? []).map(normalizeEvent),
    pagination: { totalElements, totalPages, page: number, size },
  }
}

export async function getEventById(id, signal) {
  const raw = await request(`/events/${encodeURIComponent(id)}.json`, {}, signal)
  return normalizeEvent(raw)
}

export async function getCategories(signal) {
  const data = await request('/classifications.json', { size: 20 }, signal)
  const names = (data._embedded?.classifications ?? [])
    .map((c) => c.segment?.name)
    .filter((name) => name && name !== 'Undefined')
  return [...new Set(names)]
}

// Number of pages that can actually be requested under the deep paging limit.
export function getReachablePages(totalPages, size) {
  return Math.min(totalPages, Math.ceil(MAX_RESULT_WINDOW / size))
}
