import { useDispatch, useSelector } from 'react-redux'
import {
  cancelRegistration,
  registerForEvent,
  selectIsRegistered,
} from '../features/registrations/registrationsSlice'
import { isPastEvent } from '../utils/eventTime'

// Returns why registration is unavailable, or null when it is allowed.
function getBlockReason(event) {
  if (isPastEvent(event)) return 'This event has already taken place.'
  if (event.status === 'cancelled') return 'This event has been cancelled.'
  if (event.status === 'offsale') return 'Tickets for this event are off sale.'
  return null
}

export default function RegisterButton({ event }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const registered = useSelector((state) => selectIsRegistered(state, event.id))
  const past = isPastEvent(event)
  const blockReason = getBlockReason(event)

  if (!user) return null

  if (registered) {
    return (
      <div className="registration">
        <span className="badge badge-success">You're registered</span>
        {!past && (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => dispatch(cancelRegistration({ userId: user.id, eventId: event.id }))}
          >
            Cancel registration
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="registration">
      <button
        type="button"
        className="btn"
        disabled={Boolean(blockReason)}
        onClick={() => dispatch(registerForEvent({ userId: user.id, event }))}
      >
        Register for this event
      </button>
      {blockReason && <p className="muted" role="status">{blockReason}</p>}
    </div>
  )
}
