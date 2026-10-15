import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail } from 'lucide-react'
import { Github } from '../components/BrandIcons'
import SiteFooter from '../components/SiteFooter'
import SiteHeader from '../components/SiteHeader'
import ProjectVisual from '../components/ProjectVisual'
import { portfolio } from '../data/mockData'
import './ProjectDetail.css'

function getProjectSlug() {
  const match = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)
  if (!match) return null
  try {
    return decodeURIComponent(match[1])
  } catch {
    return null
  }
}

function ProjectDetail() {
  const slug = getProjectSlug()
  const projectIndex = portfolio.projects.findIndex((item) => item.slug === slug)
  const project = portfolio.projects[projectIndex]
  const nextProject = portfolio.projects[(projectIndex + 1) % portfolio.projects.length]

  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content')
    document.title = project
      ? `${project.title} — ${portfolio.name}`
      : `Project not found — ${portfolio.name}`
    description?.setAttribute('content', project ? `${project.title}: ${project.detail}` : 'This project could not be found. Explore Santosh Singh’s AI and machine learning project collection.')
    return () => {
      document.title = previousTitle
      if (previousDescription === null) description?.removeAttribute('content')
      else if (previousDescription !== undefined) description?.setAttribute('content', previousDescription)
    }
  }, [project])

  if (!project) {
    return (
      <div className="case-page" id="top">
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main className="container case-not-found" id="main-content" tabIndex={-1}>
          <span className="case-eyebrow">A small detour / 404</span>
          <div className="case-error-mark" aria-hidden="true">?</div>
          <h1>This project is<br />off the board.</h1>
          <p>The link may have changed. There are four projects waiting for you in my selected work.</p>
          <a className="button button-primary" href="/projects"><ArrowLeft size={17} aria-hidden="true" /> Back to selected work</a>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const chapters = [
    { number: '01', title: 'The challenge', text: project.problem },
    { number: '02', title: 'How I approached it', text: project.approach },
    { number: '03', title: 'What came out of it', text: project.outcome },
  ]

  return (
    <div className="case-page" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="container case-intro" aria-labelledby="case-title">
          <a className="case-back" href="/projects"><ArrowLeft size={16} aria-hidden="true" /> Back to selected work</a>
          <div className="case-intro-topline">
            <p className="case-eyebrow"><span aria-hidden="true" /> Project notebook / {project.number}</p>
            <span className="case-category">{project.category}</span>
          </div>
          <div className="case-intro-grid">
            <h1 id="case-title">{project.title}<span className="case-title-dot">.</span></h1>
            <div className="case-intro-copy">
              <p>{project.detail}</p>
              <a className="case-source-link" href={project.github} target="_blank" rel="noreferrer"><Github size={17} aria-hidden="true" /> Explore the source <ArrowUpRight size={17} aria-hidden="true" /><span className="case-sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
        </section>

        <section className="container case-showcase" aria-label={`${project.title} project concept`}>
          <div className="case-visual-frame">
            <div className="case-visual-toolbar" aria-hidden="true">
              <span className="case-window-dots"><i /><i /><i /></span>
              <span>{project.slug} / workspace</span>
              <span className="case-window-label">PROJECT PREVIEW</span>
            </div>
            <div className="case-visual-content"><ProjectVisual tone={project.tone} /></div>
          </div>
          <div className="case-project-meta">
            <div className="case-meta-caption"><span>Built with</span><p>The tools behind the idea.</p></div>
            <div className="case-tech-list" aria-label="Technologies used">{project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}</div>
          </div>
        </section>

        <section className="container case-story" aria-labelledby="case-story-title">
          <div className="case-story-heading">
            <p className="case-eyebrow">Behind the build</p>
            <h2 id="case-story-title">From a question<br />to a working idea.</h2>
            <p>A closer look at the problem, the decisions, and the result.</p>
            <div className="case-story-stamp" aria-hidden="true"><span>LEARN.</span><span>BUILD.</span><span>REPEAT. ↗</span></div>
          </div>
          <div className="case-chapters">
            {chapters.map((chapter) => (
              <article className="case-chapter" key={chapter.number}>
                <span className="case-chapter-number">{chapter.number}</span>
                <div><h3>{chapter.title}</h3><p>{chapter.text}</p></div>
              </article>
            ))}
            <a className="button button-primary case-code-button" href={project.github} target="_blank" rel="noreferrer"><Github size={18} aria-hidden="true" /> See the code on GitHub <ArrowUpRight size={17} aria-hidden="true" /><span className="case-sr-only"> (opens in a new tab)</span></a>
          </div>
        </section>

        <section className="container case-next-section" aria-label="Next project">
          <a className={`case-next case-next-${nextProject.tone}`} href={`/projects/${nextProject.slug}`}>
            <div><span className="case-eyebrow">Keep exploring / {nextProject.number}</span><h2>{nextProject.title}</h2><p>{nextProject.category}</p></div>
            <span className="case-next-arrow" aria-hidden="true"><ArrowRight size={28} /></span>
          </a>
        </section>

        <section className="container case-contact" aria-labelledby="case-contact-title">
          <div><p className="case-eyebrow">Good ideas start with a conversation</p><h2 id="case-contact-title">Let’s build the next one.</h2></div>
          <a className="button button-secondary" href="/contact"><Mail size={17} aria-hidden="true" /> Say hello <ArrowUpRight size={17} aria-hidden="true" /></a>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

export default ProjectDetail
