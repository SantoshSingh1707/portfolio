import { lazy, Suspense, useState } from 'react'
import Navbar from './components/Navbar'

const Home = lazy(() => import('./pages/Home'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))

function NotFound() {
  return <main className="not-found"><p className="eyebrow">404 / Page not found</p><h1>Looks like this<br /><em>page wandered off.</em></h1><a href="#top">Return home <span>↗</span></a></main>
}

function App() {
  const [isDark, setIsDark] = useState(() => window.localStorage.getItem('santosh-theme') !== 'light')
  const isHomePath = window.location.pathname === '/' || window.location.pathname === ''
  const isProjectPath = window.location.pathname.startsWith('/projects/')

  const toggleTheme = () => {
    setIsDark((current) => {
      window.localStorage.setItem('santosh-theme', current ? 'light' : 'dark')
      return !current
    })
  }

  return (
    <div className={`page-container ${isDark ? 'theme-dark' : ''}`}>
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />
      <div className="page-wrapper">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {isHomePath ? <Home /> : isProjectPath ? <ProjectDetail /> : <NotFound />}
        </Suspense>
      </div>
    </div>
  )
}

export default App
