import { lazy, Suspense, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'

const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Lab = lazy(() => import('./pages/Lab'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))

const pages = { '/': Home, '/projects': Projects, '/lab': Lab, '/about': About, '/contact': Contact }
const legacySections = { '#work': '/projects', '#about': '/about', '#notes': '/about', '#toolkit': '/about#toolkit', '#contact': '/contact' }

function NotFound() {
  useEffect(() => { document.title = 'Page not found — Santosh Singh' }, [])
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main className="not-found-page container" id="main" tabIndex={-1}>
        <p>404 · Page not found</p><h1>A LITTLE OFF COURSE.</h1>
        <p className="not-found-copy">This page doesn’t exist. There’s plenty to explore back at my portfolio.</p>
        <a className="button button-primary" href="/"><ArrowLeft size={16} /> Back to my portfolio</a>
      </main>
      <SiteFooter />
    </div>
  )
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  const legacyDestination = path === '/' ? legacySections[window.location.hash] : null
  const Page = pages[path] || (/^\/projects\/[^/]+$/.test(path) ? ProjectDetail : NotFound)

  useEffect(() => {
    if (legacyDestination) window.location.replace(legacyDestination)
  }, [legacyDestination])

  return <Suspense fallback={<div className="page-loading" role="status">Loading portfolio…</div>}>{legacyDestination ? <div className="page-loading" role="status">Opening page…</div> : <Page />}</Suspense>
}
