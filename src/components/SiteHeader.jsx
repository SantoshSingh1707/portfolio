import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { portfolio } from '../data/mockData'

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Lab', href: '/lab' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef(null)
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const currentPage = (href) => {
    if (pathname === href) return 'page'
    if (href === '/projects' && pathname.startsWith('/projects/')) return 'location'
    return undefined
  }

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="site-brand" href="/" aria-label="Santosh Singh home">
          <span className="brand-symbol" aria-hidden="true">SS</span>
          <span>SANTOSH SINGH<span className="brand-caption">Student in progress.</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ label, href }) => <a key={href} className={currentPage(href) ? 'is-active' : ''} aria-current={currentPage(href)} href={href}>{label}</a>)}
        </nav>
        <a className="header-resume" href={portfolio.resume} target="_blank" rel="noreferrer">My résumé <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
      </div>
      <nav className="mobile-nav" id="mobile-navigation" hidden={!menuOpen} aria-label="Mobile navigation">
        {navigation.map(({ label, href }) => <a key={href} className={currentPage(href) ? 'is-active' : ''} aria-current={currentPage(href)} href={href} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={20} aria-hidden="true" /></a>)}
        <a href={portfolio.resume} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>My résumé<ArrowUpRight size={20} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        <span>AI &amp; ML student · Class of 2027</span>
      </nav>
    </header>
  )
}
export default SiteHeader
