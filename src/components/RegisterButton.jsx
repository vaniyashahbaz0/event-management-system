import { useSelector } from 'react-redux'
import { selectIsRegistered } from '../features/registrations/registrationsSlice'
import { useRegistrationActions } from '../hooks/useRegistrationActions'
import { isPastEvent } from '../utils/eventTime'

// Returns why registration is unavailable, or null when it is allowed.
function getBlockReason(event) {
  if (isPastEvent(event)) return 'This event has already taken place.'
  if (event.status === 'cancelled') return 'This event has been cancelled.'
  if (event.status === 'offsale') return 'Tickets for this event are off sale.'
  return null
}

export default function RegisterButton({ event }) {
  const user = useSelector((state) => state.auth.user)
  const registered = useSelector((state) => selectIsRegistered(state, event.id))
  const { register, cancel } = useRegistrationActions()

  if (!user) return null

  if (registered) {
    return (
      <div className="registration">
        <span className="badge badge-success">You're registered</span>
        {!isPastEvent(event) && (
          <button type="button" className="btn btn-danger" onClick={() => cancel(event)}>
            Cancel registration
          </button>
        )}
      </div>
    )
  }

  const blockReason = getBlockReason(event)
  return (
    <div className="registration">
      <button type="button" className="btn" disabled={Boolean(blockReason)} onClick={() => register(event)}>
        Register for this event
      </button>
      {blockReason && <p className="muted">{blockReason}</p>}
    </div>
  )
}
