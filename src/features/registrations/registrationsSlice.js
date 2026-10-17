import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit'
import { loadJSON } from '../../utils/storage'

export const STORAGE_KEY = 'registrations'

// Only the fields My Events needs, so it works without refetching.
const toEventSnapshot = (event) => ({
  id: event.id,
  name: event.name,
  image: event.image ?? null,
  date: event.date ?? null,
  time: event.time ?? null,
  dateTime: event.dateTime ?? null,
  venueName: event.venueName ?? null,
  city: event.city ?? null,
  country: event.country ?? null,
  category: event.category ?? null,
  url: event.url ?? null,
})

// Ignore anything in localStorage that does not look like a registration.
const isValidItem = (item) =>
  item && typeof item === 'object' && item.id && item.userId && item.eventId && item.event

const loadRegistrations = () => {
  const items = loadJSON(STORAGE_KEY, [])
  return Array.isArray(items) ? items.filter(isValidItem) : []
}

const initialState = { items: loadRegistrations() }

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    registerForEvent: {
      // prepare keeps the reducer pure by generating the id and timestamp beforehand.
      prepare: ({ userId, event }) => ({
        payload: {
          id: nanoid(),
          userId,
          eventId: event.id,
          registeredAt: new Date().toISOString(),
          event: toEventSnapshot(event),
        },
      }),
      reducer(state, action) {
        const { userId, eventId } = action.payload
        // Duplicates are rejected here so they are impossible even if the UI is bypassed.
        const duplicate = state.items.some((r) => r.userId === userId && r.eventId === eventId)
        if (duplicate) return
        state.items.push(action.payload)
      },
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload
      state.items = state.items.filter((r) => !(r.userId === userId && r.eventId === eventId))
    },
  },
})

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions
export default registrationsSlice.reducer

const selectItems = (state) => state.registrations.items
const selectUserId = (state) => state.auth.user?.id ?? null

// Only the logged-in user's registrations are ever exposed.
export const selectUserRegistrations = createSelector([selectItems, selectUserId], (items, userId) =>
  userId ? items.filter((r) => r.userId === userId) : [],
)

export const selectIsRegistered = (state, eventId) => {
  const userId = selectUserId(state)
  return Boolean(userId) && selectItems(state).some((r) => r.userId === userId && r.eventId === eventId)
}
