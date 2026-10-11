import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCategories, getEventById, getEvents, PAGE_SIZE } from '../../services/ticketmaster'

export const DEFAULT_FILTERS = {
  keyword: '',
  category: '',
  city: '',
  dateFrom: '',
  dateTo: '',
  upcoming: false,
}

const DEFAULT_CATEGORIES = ['Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous']

const rejection = (err, rejectWithValue) =>
  rejectWithValue({ message: err.message, status: err.status })

// The condition callbacks skip a request identical to one already in flight
// (e.g. React StrictMode running effects twice in development).
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ filters, page }, { signal, rejectWithValue }) => {
    try {
      return await getEvents(filters, page, signal)
    } catch (err) {
      return rejection(err, rejectWithValue)
    }
  },
  {
    condition: (arg, { getState }) => {
      const { listStatus, listKey } = getState().events
      return !(listStatus === 'loading' && listKey === JSON.stringify(arg))
    },
  },
)

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { signal, rejectWithValue }) => {
    try {
      return await getEventById(id, signal)
    } catch (err) {
      return rejection(err, rejectWithValue)
    }
  },
  {
    condition: (id, { getState }) => {
      const { detailsStatus, detailsKey } = getState().events
      return !(detailsStatus === 'loading' && detailsKey === id)
    },
  },
)

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { signal, rejectWithValue }) => {
    try {
      return await getCategories(signal)
    } catch (err) {
      return rejection(err, rejectWithValue)
    }
  },
  { condition: (_, { getState }) => getState().events.categoriesStatus === 'idle' },
)

const initialState = {
  items: [],
  pagination: { page: 0, size: PAGE_SIZE, totalElements: 0, totalPages: 0 },
  filters: DEFAULT_FILTERS,
  listStatus: 'idle',
  listError: null,
  listKey: null,
  listRequestId: null,
  selectedEvent: null,
  detailsStatus: 'idle',
  detailsError: null,
  detailsNotFound: false,
  detailsKey: null,
  detailsRequestId: null,
  categories: DEFAULT_CATEGORIES,
  categoriesStatus: 'idle',
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...DEFAULT_FILTERS, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      // Responses whose requestId no longer matches are stale and ignored.
      .addCase(fetchEvents.pending, (state, action) => {
        state.listStatus = 'loading'
        state.listError = null
        state.listKey = JSON.stringify(action.meta.arg)
        state.listRequestId = action.meta.requestId
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        if (state.listRequestId !== action.meta.requestId) return
        state.listStatus = 'succeeded'
        state.items = action.payload.events
        state.pagination = action.payload.pagination
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (state.listRequestId !== action.meta.requestId || action.meta.aborted) return
        state.listStatus = 'failed'
        state.listError = action.payload?.message ?? action.error.message
      })
      .addCase(fetchEventById.pending, (state, action) => {
        state.detailsStatus = 'loading'
        state.detailsError = null
        state.detailsNotFound = false
        state.selectedEvent = null
        state.detailsKey = action.meta.arg
        state.detailsRequestId = action.meta.requestId
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId) return
        state.detailsStatus = 'succeeded'
        state.selectedEvent = action.payload
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId || action.meta.aborted) return
        state.detailsStatus = 'failed'
        state.detailsNotFound = action.payload?.status === 404
        state.detailsError = action.payload?.message ?? action.error.message
      })
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded'
        if (action.payload.length) state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state) => {
        // Keep the default category list if the request fails.
        state.categoriesStatus = 'failed'
      })
  },
})

export const { setFilters } = eventsSlice.actions
export default eventsSlice.reducer
