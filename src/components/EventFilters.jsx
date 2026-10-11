import useDebouncedInput from '../hooks/useDebouncedInput'
import { DEFAULT_FILTERS } from '../features/events/eventsSlice'

export default function EventFilters({ filters, categories, onChange, onReset }) {
  const [city, setCity] = useDebouncedInput(filters.city, (value) => onChange({ city: value }))
  const hasActiveFilters = Object.keys(DEFAULT_FILTERS).some(
    (key) => key !== 'keyword' && filters[key] !== DEFAULT_FILTERS[key],
  )

  return (
    <div className="filters">
      <div className="form-field">
        <label htmlFor="category">Category</label>
        <select id="category" className="input" value={filters.category} onChange={(e) => onChange({ category: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="city">City</label>
        <input id="city" className="input" placeholder="e.g. New York" value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div className="form-field">
        <label htmlFor="dateFrom">From</label>
        <input id="dateFrom" type="date" className="input" value={filters.dateFrom} max={filters.dateTo || undefined} onChange={(e) => onChange({ dateFrom: e.target.value })} />
      </div>
      <div className="form-field">
        <label htmlFor="dateTo">To</label>
        <input id="dateTo" type="date" className="input" value={filters.dateTo} min={filters.dateFrom || undefined} onChange={(e) => onChange({ dateTo: e.target.value })} />
      </div>
      <div className="filters-actions">
        <label className="checkbox">
          <input type="checkbox" checked={filters.upcoming} onChange={(e) => onChange({ upcoming: e.target.checked })} />
          Upcoming events
        </label>
        {hasActiveFilters && (
          <button type="button" className="btn btn-outline" onClick={onReset}>Clear filters</button>
        )}
      </div>
    </div>
  )
}
