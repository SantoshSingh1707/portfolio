import { ArrowUp, ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { portfolio } from '../data/mockData'

const sitePages = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Lab', href: '/lab' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div><p className="footer-kicker">The next good thing starts with hello.</p><Link className="footer-invite" to="/contact">Let’s talk.<ArrowUpRight aria-hidden="true" /></Link></div>
          <div className="footer-aside"><p>Have an idea, a question,<br />or a project worth building?</p><a className="back-to-top" href="#top">Back to the top<ArrowUp size={14} aria-hidden="true" /></a></div>
        </div>
        <nav className="footer-site-nav" aria-label="Explore the portfolio">{sitePages.map(({ label, href }) => <Link key={href} to={href}>{label}<ArrowUpRight size={14} aria-hidden="true" /></Link>)}</nav>
        <div className="footer-details">
          <Link className="footer-brand" to="/">SANTOSH SINGH<span>AI/ML student. Learning by building.</span></Link>
          <nav className="footer-socials" aria-label="Social links">
            <a href={portfolio.github} target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a href={portfolio.linkedin} target="_blank" rel="noreferrer">LinkedIn<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a href="https://leetcode.com/u/santosh102969/" target="_blank" rel="noreferrer">LeetCode<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            <a href={`mailto:${portfolio.email}`}>Email<ArrowUpRight size={15} aria-hidden="true" /></a>
          </nav>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Santosh Singh</span><span><MapPin size={12} aria-hidden="true" />Dehradun, India</span><span>Still learning. Still making.</span></div>
      </div>
    </footer>
  )
}
export default SiteFooter
