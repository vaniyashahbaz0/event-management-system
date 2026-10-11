import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import eventsReducer from '../features/events/eventsSlice'
import { removeKey, saveJSON } from '../utils/storage'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
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

