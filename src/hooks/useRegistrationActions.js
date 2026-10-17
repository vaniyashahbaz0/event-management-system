import { useDispatch, useStore } from 'react-redux'
import {
  cancelRegistration,
  registerForEvent,
  selectIsRegistered,
} from '../features/registrations/registrationsSlice'
import { isPastEvent } from '../utils/eventTime'
import { useToast } from './useToast'

// Register / cancel flows shared by the details page and My Events,
// including validation, the confirm step and user feedback.
export function useRegistrationActions() {
  const dispatch = useDispatch()
  const store = useStore()
  const toast = useToast()

  const register = (event) => {
    const state = store.getState()
    const user = state.auth.user
    if (!user) return toast.error('Please log in to register.')
    if (selectIsRegistered(state, event.id)) return toast.info('You are already registered for this event.')
    if (isPastEvent(event)) return toast.error('This event has already taken place.')
    dispatch(registerForEvent({ userId: user.id, event }))
    toast.success(`You're registered for ${event.name}.`)
  }

  const cancel = (event) => {
    const user = store.getState().auth.user
    if (!user) return
    if (!window.confirm(`Cancel your registration for "${event.name}"?`)) return
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }))
    toast.success('Registration cancelled.')
  }

  return { register, cancel }
}
