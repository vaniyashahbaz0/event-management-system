export default function StatusMessage({ title, message, actionLabel, onAction }) {
  return (
    <div className="status-message" role="status">
      <h2>{title}</h2>
      {message && <p className="muted">{message}</p>}
      {onAction && (
        <button type="button" className="btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}
