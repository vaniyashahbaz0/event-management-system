import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import EventCard from '../components/EventCard'
import EventCardSkeleton from '../components/EventCardSkeleton'
import Pagination from '../components/Pagination'
import StatusMessage from '../components/StatusMessage'
import { fetchEvents, setFilters } from '../features/events/eventsSlice'
import { getReachablePages, PAGE_SIZE } from '../services/ticketmaster'
import { buildSearchParams, parseSearchParams } from '../utils/eventParams'

export default function Events() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { items, pagination, listStatus, listError } = useSelector((state) => state.events)
  const { filters, page } = parseSearchParams(searchParams)
  const query = searchParams.toString()

  useEffect(() => {
    const parsed = parseSearchParams(new URLSearchParams(query))
    dispatch(setFilters(parsed.filters))
    dispatch(fetchEvents({ filters: parsed.filters, page: parsed.page - 1 }))
  }, [dispatch, query])

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
      {content}
    </section>
  )
}
