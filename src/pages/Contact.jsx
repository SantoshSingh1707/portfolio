import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, Code2, Copy, Mail, MapPin, MessageSquare, Plus } from 'lucide-react'
import { Github, Linkedin } from '../components/BrandIcons'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { portfolio } from '../data/mockData'
import './ContactPage.css'

const starters = [
  {
    id: 'project', label: 'Project idea', number: '01',
    subject: 'A project idea to build together',
    body: "Hi Santosh,\n\nI'd like to talk about a project idea.\n\nThe idea:\nWhat I would like to build:\nHow we could work together:\n\nThanks,\n[Your name]",
  },
  {
    id: 'internship', label: 'Internship', number: '02',
    subject: 'Internship opportunity — AI & ML',
    body: "Hi Santosh,\n\nI'd like to discuss an internship opportunity.\n\nOrganization:\nRole and focus:\nRelevant details or next steps:\n\nThanks,\n[Your name]",
  },
  {
    id: 'conversation', label: 'AI/ML conversation', number: '03',
    subject: "Let's talk AI & ML",
    body: "Hi Santosh,\n\nI'd like to exchange ideas about AI and machine learning.\n\nThe topic or question:\nWhat I'm exploring:\n\nThanks,\n[Your name]",
  },
]

const socials = [
  { name: 'GitHub', description: 'The projects, the experiments, and the code behind them.', handle: 'SantoshSingh1707', href: portfolio.github, Icon: Github },
  { name: 'LinkedIn', description: 'Education, experience, and the people I learn alongside.', handle: 'Santosh Singh', href: portfolio.linkedin, Icon: Linkedin },
  { name: 'LeetCode', description: 'Working through problems, one pattern at a time.', handle: 'santosh102969', href: 'https://leetcode.com/u/santosh102969/', Icon: Code2 },
]

function ConversationSignal() {
  return (
    <div className="contactpage-signal" aria-hidden="true">
      <svg viewBox="0 0 380 380" fill="none">
        <circle cx="190" cy="190" r="166" stroke="currentColor" strokeOpacity=".1" strokeDasharray="2 8" />
        <ellipse className="contactpage-orbit-one" cx="190" cy="190" rx="173" ry="71" stroke="currentColor" strokeOpacity=".45" transform="rotate(-36 190 190)" />
        <ellipse className="contactpage-orbit-two" cx="190" cy="190" rx="173" ry="71" stroke="var(--accent)" strokeWidth="2" transform="rotate(38 190 190)" />
        <path d="M126 106h128c28 0 44 17 44 45v76c0 28-16 45-44 45h-78l-55 32 12-37c-24-3-39-19-39-44v-72c0-28 15-45 32-45Z" fill="var(--accent)" />
        <path d="M126 106h128c28 0 44 17 44 45v76c0 28-16 45-44 45h-78l-55 32 12-37c-24-3-39-19-39-44v-72c0-28 15-45 32-45Z" stroke="var(--ink)" strokeOpacity=".17" />
        <circle cx="145" cy="188" r="10" fill="var(--accent-ink)" /><circle cx="190" cy="188" r="10" fill="var(--accent-ink)" /><circle cx="235" cy="188" r="10" fill="var(--accent-ink)" />
        <circle cx="331" cy="100" r="7" fill="var(--ink)" /><circle cx="55" cy="275" r="5" fill="var(--accent)" />
        <path d="M54 76v22m-11-11h22M317 287v18m-9-9h18" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <span>A good question is a good beginning.</span>
    </div>
  )
}

function Contact() {
  const [selectedStarter, setSelectedStarter] = useState('project')
  const [copyState, setCopyState] = useState('idle')
  const copyTimer = useRef(null)
  const mounted = useRef(false)
  const starter = starters.find((item) => item.id === selectedStarter)
  const emailHref = `mailto:${portfolio.email}?subject=${encodeURIComponent(starter.subject)}&body=${encodeURIComponent(starter.body)}`

  useEffect(() => {
    mounted.current = true
    const previousTitle = document.title
    const previousDescription = document.querySelector('meta[name="description"]')
    const description = previousDescription || document.createElement('meta')
    const previousContent = previousDescription?.getAttribute('content')
    if (!previousDescription) {
      description.setAttribute('name', 'description')
      document.head.appendChild(description)
    }
    document.title = `Contact ${portfolio.name} — AI & ML Student`
    description.setAttribute('content', 'Start a conversation with Santosh Singh, an AI & ML student and developer in Dehradun. Connect about a project, an internship, or an AI/ML question.')
    return () => {
      mounted.current = false
      window.clearTimeout(copyTimer.current)
      document.title = previousTitle
      if (!previousDescription) description.remove()
      else if (previousContent === null) description.removeAttribute('content')
      else description.setAttribute('content', previousContent)
    }
  }, [])

  async function copyEmail() {
    window.clearTimeout(copyTimer.current)
    setCopyState('copying')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(portfolio.email)
      if (!mounted.current) return
      setCopyState('copied')
      copyTimer.current = window.setTimeout(() => setCopyState('idle'), 3500)
    } catch {
      if (!mounted.current) return
      setCopyState('error')
      copyTimer.current = window.setTimeout(() => setCopyState('idle'), 9000)
    }
  }

  const copyFeedback = copyState === 'copied'
    ? 'Email address copied.'
    : copyState === 'error'
      ? 'Copy is unavailable here. Select the address to copy it, or use the email link.'
      : ''

  return (
    <div className="contactpage" id="top">
      <a className="skip-link" href="#contactpage-main">Skip to content</a>
      <SiteHeader />
      <main id="contactpage-main" tabIndex={-1}>
        <section className="contactpage-hero container" aria-labelledby="contactpage-title">
          <div className="contactpage-topline"><span>Contact / Start a conversation</span><span><MapPin size={13} aria-hidden="true" />{portfolio.location}</span></div>
          <div className="contactpage-hero-grid">
            <div className="contactpage-hero-copy">
              <p className="contactpage-kicker"><span aria-hidden="true" />Ideas are better in conversation.</p>
              <h1 id="contactpage-title">Let’s build<span>something useful.</span></h1>
              <p className="contactpage-intro">A project taking shape, a question about AI/ML, or a chance to learn through real work. I’d like to hear about it.</p>
              <div className="contactpage-direct-email">
                <a className="contactpage-email-address" href={`mailto:${portfolio.email}`}>{portfolio.email}</a>
                <button className="contactpage-copy" type="button" onClick={copyEmail} disabled={copyState === 'copying'} aria-label={copyState === 'copied' ? 'Email address copied' : 'Copy email address'}>{copyState === 'copied' ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}<span>{copyState === 'copied' ? 'Copied' : copyState === 'copying' ? 'Copying…' : 'Copy email'}</span></button>
              </div>
              <p className={`contactpage-copy-feedback ${copyState === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite" aria-atomic="true">{copyFeedback}</p>
            </div>
            <ConversationSignal />
          </div>
          <a className="contactpage-starter-jump" href="#conversation"><span>Find a starting point</span><ArrowRight size={17} aria-hidden="true" /></a>
        </section>

        <section className="contactpage-conversation" id="conversation" aria-labelledby="contactpage-conversation-title">
          <div className="container contactpage-conversation-grid">
            <div className="contactpage-conversation-copy">
              <span className="contactpage-section-label">Every idea starts somewhere</span>
              <h2 id="contactpage-conversation-title">What’s<br />on your mind<span>?</span></h2>
              <p>Pick a topic and I’ll give you a starting point. Make it your own in your email app.</p>
              <div className="contactpage-starters" role="group" aria-label="Choose an email conversation starter">
                {starters.map((item) => <button type="button" key={item.id} className={selectedStarter === item.id ? 'is-selected' : ''} aria-pressed={selectedStarter === item.id} aria-controls="contactpage-email-preview" onClick={() => setSelectedStarter(item.id)}><span className="contactpage-starter-number">{item.number}</span><span>{item.label}</span>{selectedStarter === item.id ? <Check size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}</button>)}
              </div>
              <span className="contactpage-conversation-footnote"><MessageSquare size={15} aria-hidden="true" />One good conversation can change an idea.</span>
            </div>
            <div className="contactpage-email-preview" id="contactpage-email-preview">
              <div className="contactpage-preview-topline"><span><Mail size={16} aria-hidden="true" />Your email starting point</span><span aria-hidden="true">↗</span></div>
              <div className="contactpage-preview-recipient"><span>To</span><span>{portfolio.email}</span></div>
              <div aria-live="polite" aria-atomic="true"><div className="contactpage-preview-content" key={starter.id}><span className="contactpage-preview-label">Subject</span><h3>{starter.subject}</h3><p>{starter.body}</p></div></div>
              <div className="contactpage-preview-action"><a className="button button-primary" href={emailHref}>Open email app<ArrowUpRight size={18} aria-hidden="true" /></a><p>Add your details in your email app before sending.</p></div>
            </div>
          </div>
        </section>

        <section className="contactpage-elsewhere container" aria-labelledby="contactpage-elsewhere-title">
          <div className="contactpage-elsewhere-heading"><div><span className="contactpage-section-label">A few other places</span><h2 id="contactpage-elsewhere-title">Follow the work.</h2></div><p>Code, conversations, and the learning in between.</p></div>
          <div className="contactpage-social-grid">{socials.map(({ name, description, handle, href, Icon }, index) => <a className="contactpage-social" href={href} key={name} target="_blank" rel="noreferrer"><div className="contactpage-social-top"><Icon size={26} aria-hidden="true" /><span>0{index + 1}</span><ArrowUpRight size={23} aria-hidden="true" /></div><h3>{name}</h3><p>{description}</p><span className="contactpage-social-handle">{handle}<span className="sr-only"> (opens in a new tab)</span></span></a>)}</div>
        </section>

        <div className="contactpage-next container"><span>Want a little more context first?</span><a href="/projects">Explore my projects<ArrowRight size={18} aria-hidden="true" /></a></div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default Contact
