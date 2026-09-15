import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import './Navbar.css'

function Navbar({ isDark, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'leetcode', label: 'LeetCode' },
    { id: 'work', label: 'Selected work' },
    { id: 'lab', label: 'AI Lab' },
    { id: 'skills', label: 'Toolkit' },
    { id: 'journey', label: 'Journey' },
    { id: 'notes', label: 'Notes' },
    { id: 'contact', label: 'Contact' },
  ]

  const handleNav = () => {
    setIsOpen(false)
  }

  return (
    <nav className="navbar">
      <a className="nav-brand" href="#top" onClick={handleNav}>SS<span>.</span></a>

      <button className="menu-toggle" type="button" aria-expanded={isOpen} aria-controls="primary-navigation" aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <ul id="primary-navigation" className={`nav-links ${isOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              className="nav-link"
              href={`#${item.id}`}
              onClick={handleNav}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-actions"><button className="theme-toggle" type="button" aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`} onClick={toggleTheme}>{isDark ? 'Light' : 'Dark'}</button><a className="nav-availability" href="mailto:santosh102969@gmail.com">Let's talk <ArrowUpRight size={15} /></a></div>
    </nav>
  )
}

export default Navbar
