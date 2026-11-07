import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('GRANTLY view failed to render', error, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="empty-state" role="alert">
          <h2>Something went wrong loading this view</h2>
          <p>Your saved scholarships and applications are still stored in this browser.</p>
          <div className="actions">
            <button className="btn primary" type="button" onClick={() => this.setState({ hasError: false })}>
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
