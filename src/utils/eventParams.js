// Converts between URL search params and { filters, page } (page is 1-based in the URL).
import { DEFAULT_FILTERS } from '../features/events/eventsSlice'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function parseSearchParams(searchParams) {
  const page = Number.parseInt(searchParams.get('page'), 10)
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''
  const dateFrom = DATE_RE.test(from) ? from : ''
  // An end date before the start date would make the API request invalid.
  const dateTo = DATE_RE.test(to) && (!dateFrom || to >= dateFrom) ? to : ''
  return {
    filters: {
      ...DEFAULT_FILTERS,
      keyword: searchParams.get('q') ?? '',
      category: searchParams.get('category') ?? '',
      city: searchParams.get('city') ?? '',
      dateFrom,
      dateTo,
      upcoming: searchParams.get('upcoming') === '1',
    },
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function buildSearchParams(filters, page) {
  const params = new URLSearchParams()
  if (filters.keyword) params.set('q', filters.keyword)
  if (filters.category) params.set('category', filters.category)
  if (filters.city) params.set('city', filters.city)
  if (filters.dateFrom) params.set('from', filters.dateFrom)
  if (filters.dateTo) params.set('to', filters.dateTo)
  if (filters.upcoming) params.set('upcoming', '1')
  if (page > 1) params.set('page', String(page))
  return params
}
