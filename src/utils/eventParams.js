// Converts between URL search params and { filters, page } (page is 1-based in the URL).
import { DEFAULT_FILTERS } from '../features/events/eventsSlice'

export function parseSearchParams(searchParams) {
  const page = Number.parseInt(searchParams.get('page'), 10)
  return {
    filters: { ...DEFAULT_FILTERS },
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function buildSearchParams(filters, page) {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  return params
}
