import { Component } from 'react'

// Catches a crash in any component below it, so the user sees a friendly card instead of a white screen.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('[ui] crashed:', error, info?.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    const btn = 'rounded-lg px-4 py-2 text-sm font-medium'
    return (
      <div className="flex h-dvh items-center justify-center bg-[#02050a] p-4 text-[#e6edf3]">
        <div className="w-full max-w-[420px] rounded-2xl border border-[#2b3646] bg-[#0f151d] p-7 text-center shadow-2xl">
          <h1 className="mb-2 text-xl font-semibold">Something went wrong</h1>
          <p className="mb-5 text-sm leading-relaxed text-[#8b98a9]">
            Docume hit an unexpected problem. Your saved chats are safe. Reload the page to continue.
          </p>
          <div className="flex justify-center gap-2.5">
            <button className={`${btn} border border-[#2b3646] hover:bg-white/5`} onClick={() => this.setState({ failed: false })}>
              Try again
            </button>
            <button className={`${btn} bg-[#238636] text-white hover:bg-[#2ea043]`} onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
