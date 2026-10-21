import { Link } from "@tanstack/react-router"
import { useEffect } from 'react'
import { ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import NeuralWorkbench from '../components/NeuralWorkbench'
import ProjectVisual from '../components/ProjectVisual'
import { usePageMotion } from '../hooks/usePageMotion'
import { portfolio } from '../data/mockData'
import portrait from '../assets/me.png'
import portraitAvif from '../assets/me.avif'
import portraitWebp from '../assets/me.webp'
import './Home.css'

const subjects = ['AI', 'Machine learning', 'Computer vision', 'Data science', 'Systems']

const fieldNotes = [
  { title: 'Grounded beats clever.', body: 'Retrieval tied to a learner’s own documents is what makes a study tool worth trusting.' },
  { title: 'Private by default.', body: 'Local inference keeps source code on the machine it came from.' },
  { title: 'Reproducible or it didn’t happen.', body: 'A pipeline is only useful if the next run can match this one.' },
  { title: 'Ask what the model sees.', body: 'A label is easier to trust when the signals behind it are visible.' },
]

export default function Home() {
  usePageMotion()
  useEffect(() => {
    document.title = 'Santosh Singh — AI & ML Student'
    const description = document.querySelector('meta[name="description"]')
    description?.setAttribute('content', 'Explore Santosh Singh’s interactive AI/ML portfolio: projects, working experiments, and the learning journey of a DIT student, Class of 2027.')
  }, [])
  const featured = portfolio.projects[0]

  return (
    <div className="site-shell home-page" id="top" data-page-motion>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="home-introduction container" data-hero aria-labelledby="home-title">
          <div className="home-intro-heading"><p className="home-status"><span />Santosh Singh · AI/ML student</p><h1 id="home-title">Human<br className="home-mobile-title-break" /> curiosity.<br />Machine<br className="home-mobile-title-break" /> <span className="home-title-accent">learning.</span></h1></div>
          <div className="home-intro-copy"><p>I’m <em>learning</em> how machines learn—and building things along the way.</p><span>Computer Science at DIT, Dehradun · Class of 2027</span><div className="home-intro-actions"><Link className="home-intro-projects" to="/projects">View selected projects<ArrowRight size={17} aria-hidden="true" /></Link><Link to="/about">The person behind the projects<ArrowUpRight size={17} aria-hidden="true" /></Link><a className="home-intro-resume" href={portfolio.resume} target="_blank" rel="noreferrer">My résumé<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div></div>
          <figure className="home-portrait"><div className="home-portrait-frame"><span className="home-portrait-bar" aria-hidden="true" /><span className="home-portrait-mark" aria-hidden="true">S.</span><picture><source srcSet={portraitAvif} type="image/avif" /><source srcSet={portraitWebp} type="image/webp" /><img src={portrait} alt="Santosh Singh wearing his DIT University hoodie" width="750" height="879" fetchPriority="high" decoding="async" /></picture></div><figcaption><span>{portfolio.name}</span><span>{portfolio.location}<br />Class of 2027</span></figcaption></figure>
        </section>

        <section className="home-profile container" aria-labelledby="home-profile-title" data-reveal>
          <div className="home-profile-heading"><span className="home-section-label">A quick introduction</span><h2 id="home-profile-title">A few things<br />about my work.</h2></div>
          <dl className="home-profile-facts">
            <div><dt>Study</dt><dd>B.Tech, Computer Science &amp; Engineering<span>DIT · Class of 2027</span></dd></div>
            <div><dt>Focus</dt><dd>AI, machine learning<span>Data science projects</span></dd></div>
            <div><dt>Based in</dt><dd>{portfolio.location}</dd></div>
            <div><dt>Practice</dt><dd>280+ problems solved<span>Data structures &amp; algorithms · Java</span></dd></div>
          </dl>
          <div className="home-profile-actions"><a href={portfolio.resume} target="_blank" rel="noreferrer">Read my résumé<ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a><Link to="/contact">Contact me<Mail size={16} aria-hidden="true" /></Link></div>
        </section>

        <section className="home-subjects" aria-label="Subject areas">
          <div className="container home-subjects-inner">{subjects.map((subject) => <span className="home-subject" key={subject}><i aria-hidden="true" />{subject}</span>)}</div>
        </section>

        <section className="home-workbench container" data-reveal aria-label="Interactive project explorer"><NeuralWorkbench /></section>
        <div className="home-explorer-note container"><span>A project map you can explore. Choose an input to follow a different path.</span><Link to="/projects">All projects<ArrowRight size={17} aria-hidden="true" /></Link></div>

        <section className="home-feature container" data-reveal aria-labelledby="home-feature-title">
          <div className="home-feature-copy"><span className="home-section-label">Inside the work</span><h2 id="home-feature-title">From your notes.<br />To your next<br />breakthrough.</h2><p>{featured.summary}</p><Link to={`/projects/${featured.slug}`} className="home-feature-link">Explore {featured.title}<ArrowUpRight size={19} /></Link></div>
          <Link className="home-feature-visual" to={`/projects/${featured.slug}`} aria-label="Read the AI Study Tool case study"><ProjectVisual tone="study" /><span><ArrowUpRight size={23} /></span></Link>
        </section>

        <section className="home-index container" data-reveal aria-labelledby="home-index-title">
          <div className="home-index-heading"><div><span className="home-section-label">The working collection</span><h2 id="home-index-title">Four projects.<br />One habit of building.</h2></div><Link className="home-index-all" to="/projects">All projects<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          <ol className="home-index-list">{portfolio.projects.map((project) => (
            <li className="home-index-item" key={project.slug}>
              <span className="home-index-number" aria-hidden="true">{project.number}</span>
              <Link className="home-index-thumb" to={`/projects/${project.slug}`} aria-label={`Read the ${project.title} case study`}><ProjectVisual tone={project.tone} /></Link>
              <div className="home-index-copy"><span className="home-index-category">{project.category}</span><h3><Link to={`/projects/${project.slug}`}>{project.title}<ArrowUpRight size={18} aria-hidden="true" /></Link></h3><p>{project.summary}</p></div>
              <Link className="home-index-read" to={`/projects/${project.slug}`}>Case study<ArrowRight size={15} aria-hidden="true" /></Link>
            </li>
          ))}</ol>
        </section>

        <section className="home-notes" data-reveal aria-labelledby="home-notes-title">
          <div className="container home-notes-inner">
            <div className="home-notes-heading"><span className="home-section-label">Field notes</span><h2 id="home-notes-title">What the work<br />keeps teaching me.</h2></div>
            <ol className="home-notes-list">{fieldNotes.map((note, index) => (
              <li className="home-note" key={note.title}><span className="home-note-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{note.title}</h3><p>{note.body}</p></div></li>
            ))}</ol>
          </div>
        </section>

        <section className="home-timeline container" data-reveal aria-labelledby="home-timeline-title">
          <div className="home-timeline-heading"><span className="home-section-label">Where I’m learning</span><h2 id="home-timeline-title">The path<br />so far.</h2><Link className="home-timeline-more" to="/about">More about me<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
          <ol className="home-timeline-list">{portfolio.milestones.map((item) => (
            <li className="home-timeline-item" key={item.label}>
              <span className="home-timeline-when"><span className="home-timeline-period">{item.period}</span><span className="home-timeline-label">{item.label}</span></span>
              <div className="home-timeline-body"><h3>{item.title}</h3><p>{item.place}</p></div>
            </li>
          ))}</ol>
        </section>

        <section className="home-contact" data-reveal aria-labelledby="home-contact-title">
          <div className="container home-contact-inner">
            <div className="home-contact-copy"><span className="home-section-label">One more thing</span><h2 id="home-contact-title">Have a project, a question,<br />or a good idea?</h2></div>
            <div className="home-contact-actions">
              <Link className="home-contact-primary" to="/contact">Let’s talk<ArrowRight size={18} aria-hidden="true" /></Link>
              <a className="home-contact-link" href={`mailto:${portfolio.email}`}>{portfolio.email}<ArrowUpRight size={15} aria-hidden="true" /></a>
              <a className="home-contact-link" href={portfolio.resume} target="_blank" rel="noreferrer">Résumé<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
