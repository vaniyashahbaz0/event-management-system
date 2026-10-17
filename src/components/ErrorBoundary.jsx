import { Component } from 'react'

// Last line of defence: shows a recovery screen instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <main className="container">
        <div className="card center" role="alert">
          <h1>Something went wrong</h1>
          <p className="muted">An unexpected error occurred. Reloading the page usually fixes it.</p>
          <button type="button" className="btn" onClick={() => window.location.assign('/')}>
            Reload app
          </button>
        </div>
      </main>
    )
  }
}
