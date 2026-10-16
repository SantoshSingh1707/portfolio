import { useEffect } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import NeuralWorkbench from '../components/NeuralWorkbench'
import ProjectVisual from '../components/ProjectVisual'
import OrbitalInstrument from '../components/OrbitalInstrument'
import { portfolio } from '../data/mockData'
import portrait from '../assets/me.png'
import './Home.css'

const subjects = ['AI', 'Machine learning', 'Computer vision', 'Data science', 'Systems']

const fieldNotes = [
  { title: 'Grounded beats clever.', body: 'Retrieval tied to a learner’s own documents is what makes a study tool worth trusting.' },
  { title: 'Private by default.', body: 'Local inference keeps source code on the machine it came from.' },
  { title: 'Reproducible or it didn’t happen.', body: 'A pipeline is only useful if the next run can match this one.' },
  { title: 'Ask what the model sees.', body: 'A label is easier to trust when the signals behind it are visible.' },
]

export default function Home() {
  useEffect(() => {
    document.title = 'Santosh Singh — AI & ML Student'
    const description = document.querySelector('meta[name="description"]')
    description?.setAttribute('content', 'Explore Santosh Singh’s interactive AI/ML portfolio: projects, working experiments, and the learning journey of a DIT student, Class of 2027.')
  }, [])
  const featured = portfolio.projects[0]

  return (
    <div className="site-shell home-page" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <section className="home-introduction container" aria-labelledby="home-title">
          <div className="home-intro-heading"><p className="home-status"><span />Santosh Singh · AI/ML student</p><h1 id="home-title">Human<br className="home-mobile-title-break" /> curiosity.<br />Machine<br className="home-mobile-title-break" /> learning.</h1></div>
          <div className="home-intro-copy"><p>I’m <em>learning</em> how machines learn—and building things along the way.</p><span>Computer Science at DIT, Dehradun · Class of 2027</span><div className="home-intro-actions"><a href="/about">The person behind the projects<ArrowUpRight size={17} aria-hidden="true" /></a><a className="home-intro-resume" href={portfolio.resume} target="_blank" rel="noreferrer">My résumé<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div></div>
          <figure className="home-portrait"><div className="home-portrait-frame"><span className="home-portrait-bar" aria-hidden="true" /><span className="home-portrait-mark" aria-hidden="true">S.</span><OrbitalInstrument /><img src={portrait} alt="Santosh Singh wearing his DIT University hoodie" width="747" height="879" fetchpriority="high" /></div><figcaption><span>{portfolio.name}</span><span>{portfolio.location}<br />Class of 2027</span></figcaption></figure>
        </section>

        <section className="home-subjects" aria-label="Subject areas">
          <div className="container home-subjects-inner">{subjects.map((subject) => <span className="home-subject" key={subject}><i aria-hidden="true" />{subject}</span>)}</div>
        </section>

        <section className="home-workbench container" aria-label="Interactive project explorer"><NeuralWorkbench /></section>
        <div className="home-explorer-note container"><span>A project map you can explore. Choose an input to follow a different path.</span><a href="/projects">All projects<ArrowRight size={17} aria-hidden="true" /></a></div>

        <section className="home-feature container" aria-labelledby="home-feature-title">
          <div className="home-feature-copy"><span className="home-section-label">Inside the work</span><h2 id="home-feature-title">From your notes.<br />To your next<br />breakthrough.</h2><p>{featured.summary}</p><a href={`/projects/${featured.slug}`} className="home-feature-link">Explore {featured.title}<ArrowUpRight size={19} /></a></div>
          <a className="home-feature-visual" href={`/projects/${featured.slug}`} aria-label="Read the AI Study Tool case study"><ProjectVisual tone="study" /><span><ArrowUpRight size={23} /></span></a>
        </section>

        <section className="home-index container" aria-labelledby="home-index-title">
          <div className="home-index-heading"><div><span className="home-section-label">The working collection</span><h2 id="home-index-title">Four projects.<br />One habit of building.</h2></div><a className="home-index-all" href="/projects">All projects<ArrowUpRight size={17} aria-hidden="true" /></a></div>
          <ol className="home-index-list">{portfolio.projects.map((project) => (
            <li className="home-index-item" key={project.slug}>
              <span className="home-index-number" aria-hidden="true">{project.number}</span>
              <a className="home-index-thumb" href={`/projects/${project.slug}`} aria-label={`Read the ${project.title} case study`}><ProjectVisual tone={project.tone} /></a>
              <div className="home-index-copy"><span className="home-index-category">{project.category}</span><h3><a href={`/projects/${project.slug}`}>{project.title}<ArrowUpRight size={18} aria-hidden="true" /></a></h3><p>{project.summary}</p></div>
              <a className="home-index-read" href={`/projects/${project.slug}`}>Case study<ArrowRight size={15} aria-hidden="true" /></a>
            </li>
          ))}</ol>
        </section>

        <section className="home-notes" aria-labelledby="home-notes-title">
          <div className="container home-notes-inner">
            <div className="home-notes-heading"><span className="home-section-label">Field notes</span><h2 id="home-notes-title">What the work<br />keeps teaching me.</h2></div>
            <ol className="home-notes-list">{fieldNotes.map((note, index) => (
              <li className="home-note" key={note.title}><span className="home-note-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><div><h3>{note.title}</h3><p>{note.body}</p></div></li>
            ))}</ol>
          </div>
        </section>

        <section className="home-timeline container" aria-labelledby="home-timeline-title">
          <div className="home-timeline-heading"><span className="home-section-label">Where I’m learning</span><h2 id="home-timeline-title">The path<br />so far.</h2><a className="home-timeline-more" href="/about">More about me<ArrowUpRight size={17} aria-hidden="true" /></a></div>
          <ol className="home-timeline-list">{portfolio.milestones.map((item) => (
            <li className="home-timeline-item" key={item.label}>
              <span className="home-timeline-when"><span className="home-timeline-period">{item.period}</span><span className="home-timeline-label">{item.label}</span></span>
              <div className="home-timeline-body"><h3>{item.title}</h3><p>{item.place}</p></div>
            </li>
          ))}</ol>
        </section>

        <section className="home-contact" aria-labelledby="home-contact-title">
          <div className="container home-contact-inner">
            <div className="home-contact-copy"><span className="home-section-label">One more thing</span><h2 id="home-contact-title">Have a project, a question,<br />or a good idea?</h2></div>
            <div className="home-contact-actions">
              <a className="home-contact-primary" href="/contact">Let’s talk<ArrowRight size={18} aria-hidden="true" /></a>
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
