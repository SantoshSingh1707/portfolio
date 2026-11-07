import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useRouterState } from '@tanstack/react-router'
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
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuClosing, setMenuClosing] = useState(false)
  const menuButton = useRef(null)
  const closeTimer = useRef(null)
  const openFrame = useRef(null)
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const previousPathname = useRef(pathname)
  const currentPage = (href) => {
    if (pathname === href) return 'page'
    if (href === '/projects' && pathname.startsWith('/projects/')) return 'location'
    return undefined
  }

  const openMenu = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    if (openFrame.current !== null) window.cancelAnimationFrame(openFrame.current)
    setMenuVisible(true)
    setMenuClosing(false)
    openFrame.current = window.requestAnimationFrame(() => {
      setMenuOpen(true)
      openFrame.current = null
    })
  }, [])

  const closeMenu = useCallback((restoreFocus = false) => {
    if (openFrame.current !== null) {
      window.cancelAnimationFrame(openFrame.current)
      openFrame.current = null
    }
    setMenuOpen(false)
    setMenuClosing(true)
    if (restoreFocus) menuButton.current?.focus()

    const closeMs = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--dropdown-close-dur')
    ) || 150
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setMenuVisible(false)
      setMenuClosing(false)
      closeTimer.current = null
    }, closeMs)
  }, [])

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        closeMenu(true)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [closeMenu, menuOpen])

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname
      if (menuVisible) closeMenu()
    }
  }, [closeMenu, menuVisible, pathname])

  useEffect(() => () => {
    window.clearTimeout(closeTimer.current)
    if (openFrame.current !== null) window.cancelAnimationFrame(openFrame.current)
  }, [])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="site-brand" to="/" aria-label="Santosh Singh home">
          <span className="brand-symbol" aria-hidden="true">SS</span>
          <span>SANTOSH SINGH<span className="brand-caption">Student in progress.</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(({ label, href }) => <Link key={href} className={currentPage(href) ? 'is-active' : ''} aria-current={currentPage(href)} to={href}>{label}</Link>)}
        </nav>
        <a className="header-resume" href={portfolio.resume} target="_blank" rel="noreferrer">My résumé <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => (menuOpen || openFrame.current !== null ? closeMenu() : openMenu())}>{menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}</button>
      </div>
      <nav className={`mobile-nav t-dropdown${menuOpen ? ' is-open' : ''}${menuClosing ? ' is-closing' : ''}`} data-origin="top-center" id="mobile-navigation" hidden={!menuVisible} aria-hidden={!menuOpen} inert={!menuOpen} aria-label="Mobile navigation">
        {navigation.map(({ label, href }) => <Link key={href} className={currentPage(href) ? 'is-active' : ''} aria-current={currentPage(href)} to={href} onClick={() => closeMenu()}>{label}<ArrowUpRight size={20} aria-hidden="true" /></Link>)}
        <a href={portfolio.resume} target="_blank" rel="noreferrer" onClick={() => closeMenu()}>My résumé<ArrowUpRight size={20} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
        <span>AI &amp; ML student · Class of 2027</span>
      </nav>
    </header>
  )
}
export default SiteHeader
