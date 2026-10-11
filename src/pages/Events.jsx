import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import EventCard from '../components/EventCard'
import CategoryChips from '../components/CategoryChips'
import EventCardSkeleton from '../components/EventCardSkeleton'
import EventFilters from '../components/EventFilters'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import StatusMessage from '../components/StatusMessage'
import { DEFAULT_FILTERS, fetchCategories, fetchEvents, setFilters } from '../features/events/eventsSlice'
import { getReachablePages, PAGE_SIZE } from '../services/ticketmaster'
import { buildSearchParams, parseSearchParams } from '../utils/eventParams'

export default function Events() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { items, pagination, categories, listStatus, listError } = useSelector((state) => state.events)
  const query = searchParams.toString()
  const { filters, page } = useMemo(() => parseSearchParams(new URLSearchParams(query)), [query])

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(setFilters(filters))
    dispatch(fetchEvents({ filters, page: page - 1 }))
  }, [dispatch, filters, page])

  const updateFilters = useCallback(
    (patch) => setSearchParams(buildSearchParams({ ...filters, ...patch }, 1)),
    [filters, setSearchParams],
  )
  const searchKeyword = useCallback((keyword) => updateFilters({ keyword }), [updateFilters])

  const resetFilters = () => setSearchParams(buildSearchParams({ ...DEFAULT_FILTERS, keyword: filters.keyword }, 1))
  const retry = () => dispatch(fetchEvents({ filters, page: page - 1 }))
  const changePage = (next) => {
    setSearchParams(buildSearchParams(filters, next))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isLoading = listStatus === 'idle' || listStatus === 'loading'
  const totalPages = getReachablePages(pagination.totalPages, pagination.size)

  let content
  if (isLoading) {
    content = (
      <div className="event-grid">
        {Array.from({ length: PAGE_SIZE }, (_, i) => <EventCardSkeleton key={i} />)}
      </div>
    )
  } else if (listStatus === 'failed') {
    content = <StatusMessage title="Something went wrong" message={listError} actionLabel="Retry" onAction={retry} />
  } else if (items.length === 0) {
    content = <StatusMessage title="No events found" message="Try changing your search or filters." />
  } else {
    content = (
      <>
        <div className="event-grid">
          {items.map((event) => <EventCard key={event.id} event={event} />)}
        </div>
        <Pagination page={page} totalPages={totalPages} onPageChange={changePage} />
      </>
    )
  }

  return (
    <section>
      <h1>Events</h1>
      <SearchBar value={filters.keyword} onSearch={searchKeyword} />
      <CategoryChips categories={categories} selected={filters.category} onSelect={(category) => updateFilters({ category })} />
      <EventFilters filters={filters} categories={categories} onChange={updateFilters} onReset={resetFilters} />
      {content}
    </section>
  )
}


