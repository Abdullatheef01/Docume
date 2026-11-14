import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Landing from './landing/Landing.jsx'
import Legal from './landing/Legal.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './styles.css'

// Tiny router: "/" landing, "/app" editor, "/privacy" and "/terms" legal pages.
const path = window.location.pathname.replace(/\/+$/, '') || '/'

let Page = Landing
let pageProps = {}
if (path === '/app') Page = App
else if (path === '/privacy') (Page = Legal), (pageProps = { doc: 'privacy' })
else if (path === '/terms') (Page = Legal), (pageProps = { doc: 'terms' })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Page {...pageProps} />
    </ErrorBoundary>
  </React.StrictMode>
)
