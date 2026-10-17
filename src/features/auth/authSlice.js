import { createSlice, nanoid } from '@reduxjs/toolkit'
import { loadJSON } from '../../utils/storage'

// NOTE: Passwords are stored in plain text in localStorage ONLY because this
// is a frontend simulation with no backend. Never do this in a real app.

const loadUsers = () => {
  const users = loadJSON('users', [])
  if (!Array.isArray(users)) return []
  // Drop malformed entries so a corrupted localStorage cannot crash login/register.
  return users.filter(
    (u) => u && typeof u.id === 'string' && typeof u.email === 'string' && typeof u.password === 'string',
  )
}

const loadCurrentUser = () => {
  const user = loadJSON('currentUser', null)
  return user && typeof user === 'object' && user.id ? user : null
}

const initialState = {
  users: loadUsers(),
  user: loadCurrentUser(),
  error: null,
}

// currentUser never contains the password.
const toSessionUser = ({ id, name, email }) => ({ id, name, email })

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: {
      // prepare keeps the reducer pure by generating the id beforehand.
      prepare: ({ name, email, password }) => ({
        payload: { id: nanoid(), name: name.trim(), email: email.trim(), password },
      }),
      reducer(state, action) {
        const newUser = action.payload
        const exists = state.users.some(
          (u) => u.email.toLowerCase() === newUser.email.toLowerCase(),
        )
        if (exists) {
          state.error = 'An account with this email already exists'
          return
        }
        state.users.push(newUser)
        state.user = toSessionUser(newUser)
        state.error = null
      },
    },
    login(state, action) {
      const { email, password } = action.payload
      const found = state.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
      )
      if (!found) {
        state.error = 'Invalid email or password'
        return
      }
      state.user = toSessionUser(found)
      state.error = null
    },
    logout(state) {
      state.user = null
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const { register, login, logout, clearError } = authSlice.actions
export default authSlice.reducer
