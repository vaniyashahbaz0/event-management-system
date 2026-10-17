import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import registrationsReducer, {
  cancelRegistration,
  registerForEvent,
  STORAGE_KEY as REGISTRATIONS_KEY,
} from '../features/registrations/registrationsSlice'
import { removeKey, saveJSON } from '../utils/storage'

// Persist registrations (all users') after every change, outside the reducers.
const listenerMiddleware = createListenerMiddleware()
listenerMiddleware.startListening({
  matcher: isAnyOf(registerForEvent, cancelRegistration),
  effect: (_action, api) => saveJSON(REGISTRATIONS_KEY, api.getState().registrations.items),
})

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
  },
  middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware),
})

// Persist auth data to localStorage whenever it changes.
let prevUsers = store.getState().auth.users
let prevUser = store.getState().auth.user
store.subscribe(() => {
  const { users, user } = store.getState().auth
  if (users !== prevUsers) {
    prevUsers = users
    saveJSON('users', users)
  }
  if (user !== prevUser) {
    prevUser = user
    if (user) saveJSON('currentUser', user)
    else removeKey('currentUser')
  }
})

