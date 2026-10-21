import { Link } from "@tanstack/react-router"
import { useEffect, useState } from 'react'
import { ArrowRight, ArrowUpRight, LayoutGrid, List, Search, Video, X } from 'lucide-react'
import { Github } from '../components/BrandIcons'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ProjectVisual from '../components/ProjectVisual'
import { usePageMotion } from '../hooks/usePageMotion'
import { portfolio } from '../data/mockData'
import './ProjectsPage.css'

const filters = [
  { id: 'all', label: 'All projects', tones: null },
  { id: 'ai', label: 'AI apps', tones: ['study', 'review'] },
  { id: 'ml', label: 'Machine learning', tones: ['chart', 'vision'] },
]
const views = [
  { id: 'gallery', label: 'Spotlight gallery', Icon: LayoutGrid },
  { id: 'index', label: 'Compact index', Icon: List },
]

function readPreferences() {
  const params = new URLSearchParams(window.location.search)
  const filter = params.get('filter')
  const view = params.get('view')
  const technology = params.get('tech')
  return {
    filter: filters.some((item) => item.id === filter) ? filter : 'all',
    view: views.some((item) => item.id === view) ? view : 'gallery',
    technology: portfolio.projects.some((project) => project.stack.includes(technology)) ? technology : 'all',
    query: params.get('q') || '',
  }
}

function ProjectStack({ project }) {
  return <ul className="projectspage-stack" aria-label="Technologies used">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
}

function ProjectSource({ project, compact = false }) {
  return <a className={`projectspage-source${compact ? ' projectspage-source-compact' : ''}`} href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} source on GitHub (opens in a new tab)`}><Github size={16} /><span>Source code</span><ArrowUpRight size={14} aria-hidden="true" /></a>
}

function GalleryProject({ project }) {
  return (
    <article className={`projectspage-gallery-item projectspage-gallery-${project.tone}`}>
      <Link className="projectspage-visual" to={`/projects/${project.slug}`} aria-label={`Explore ${project.title}`}><ProjectVisual tone={project.tone} /><span className="projectspage-open"><ArrowUpRight size={24} aria-hidden="true" /></span></Link>
      <div className="projectspage-project-copy"><div className="projectspage-project-label"><span>{project.category}</span><span>{project.number} / 04</span></div><h2><Link to={`/projects/${project.slug}`}>{project.title}</Link></h2><p>{project.summary}</p><ProjectStack project={project} /><div className="projectspage-project-actions"><Link className="projectspage-explore" to={`/projects/${project.slug}`}>Explore the project<ArrowUpRight size={18} aria-hidden="true" /></Link>{project.walkthrough && <Link className="projectspage-walkthrough" to={`/projects/${project.slug}#case-demo-title`}><Video size={15} aria-hidden="true" />Watch walkthrough</Link>}<ProjectSource project={project} /></div></div>
    </article>
  )
}

function IndexProject({ project }) {
  return (
    <article className="projectspage-index-item">
      <span className="projectspage-index-number" aria-hidden="true">{project.number}</span>
      <Link className="projectspage-index-thumbnail" to={`/projects/${project.slug}`} aria-label={`Explore ${project.title}`}><ProjectVisual tone={project.tone} /></Link>
      <div className="projectspage-index-copy"><span className="projectspage-index-category">{project.category}</span><h2><Link to={`/projects/${project.slug}`}>{project.title}<ArrowUpRight size={20} aria-hidden="true" /></Link></h2><p>{project.summary}</p><ProjectStack project={project} /></div>
      <div className="projectspage-index-actions"><Link className="projectspage-index-read" to={`/projects/${project.slug}`}>Read project<ArrowRight size={16} aria-hidden="true" /></Link>{project.walkthrough && <Link className="projectspage-index-read projectspage-index-video" to={`/projects/${project.slug}#case-demo-title`}><Video size={14} aria-hidden="true" />Walkthrough</Link>}<ProjectSource project={project} compact /></div>
    </article>
  )
}

function Projects() {
  usePageMotion()
  const [preferences, setPreferences] = useState({ filter: 'all', view: 'gallery', technology: 'all', query: '' })
  const [preferencesReady, setPreferencesReady] = useState(false)
  const { filter, view, technology, query } = preferences
  const activeFilter = filters.find((item) => item.id === filter)
  const technologies = [...new Set(portfolio.projects.flatMap((project) => project.stack))].sort((a, b) => a.localeCompare(b))
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const resultsHeading = [filter !== 'all' ? activeFilter.label : '', technology !== 'all' ? technology : ''].filter(Boolean).join(' / ') || (normalizedQuery ? 'Matching projects' : 'The complete collection')
  const projects = portfolio.projects.filter((project) => {
    const matchesCategory = !activeFilter.tones || activeFilter.tones.includes(project.tone)
    const matchesTechnology = technology === 'all' || project.stack.includes(technology)
    const searchableContent = [project.title, project.category, project.summary, ...project.stack].join(' ').toLocaleLowerCase()
    return matchesCategory && matchesTechnology && (!normalizedQuery || searchableContent.includes(normalizedQuery))
  })

  useEffect(() => {
    const previousTitle = document.title
    const previousDescription = document.querySelector('meta[name="description"]')
    const description = previousDescription || document.createElement('meta')
    const previousContent = previousDescription?.getAttribute('content')
    if (!previousDescription) {
      description.setAttribute('name', 'description')
      document.head.appendChild(description)
    }
    document.title = `Projects — ${portfolio.name} | AI & Machine Learning`
    description.setAttribute('content', 'Explore Santosh Singh’s AI and machine learning projects: a RAG study tool, local code review agent, house-price pipeline, and image-forensics experiments. Browse the visual gallery or compact index.')
    return () => {
      document.title = previousTitle
      if (!previousDescription) description.remove()
      else if (previousContent === null) description.removeAttribute('content')
      else description.setAttribute('content', previousContent)
    }
  }, [])

  useEffect(() => {
    setPreferences(readPreferences())
    setPreferencesReady(true)
    const onPopState = () => setPreferences(readPreferences())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!preferencesReady) return
    const url = new URL(window.location.href)
    if (filter === 'all') url.searchParams.delete('filter')
    else url.searchParams.set('filter', filter)
    if (view === 'gallery') url.searchParams.delete('view')
    else url.searchParams.set('view', view)
    if (technology === 'all') url.searchParams.delete('tech')
    else url.searchParams.set('tech', technology)
    if (!query.trim()) url.searchParams.delete('q')
    else url.searchParams.set('q', query.trim())
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
  }, [filter, view, technology, query, preferencesReady])

  function clearFilters() {
    setPreferences((previous) => ({ ...previous, filter: 'all', technology: 'all', query: '' }))
  }

  return (
    <div className="projectspage" id="top" data-page-motion>
      <a className="skip-link" href="#projectspage-main">Skip to content</a>
      <SiteHeader />
      <main id="projectspage-main" tabIndex={-1}>
        <section className="projectspage-hero container" data-hero aria-labelledby="projectspage-title"><div className="projectspage-topline"><span>Projects / The working collection</span><span>{String(portfolio.projects.length).padStart(2, '0')} projects. Plenty of questions.</span></div><h1 id="projectspage-title">Built to learn.<br /><span>Made to work.</span></h1><div className="projectspage-intro"><p>Language, vision, and the systems around a model.<br />Here's what those questions look like in code.</p><a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={19} /><span>Follow the code on GitHub</span><ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div></section>

        <section className="projectspage-work container" data-reveal aria-label="Browse projects">
          <div className="projectspage-controls">
            <div className="projectspage-filters" role="group" aria-label="Filter projects by category">
              {filters.map((item) => {
                const count = portfolio.projects.filter((project) => !item.tones || item.tones.includes(project.tone)).length
                return <button key={item.id} type="button" aria-pressed={filter === item.id} aria-controls="projectspage-results" onClick={() => setPreferences((previous) => ({ ...previous, filter: item.id }))}>{item.label}<span>{count}</span></button>
              })}
            </div>
            <div className="projectspage-discovery">
              <label className="projectspage-technology">Technology
                <select value={technology} onChange={(event) => setPreferences((previous) => ({ ...previous, technology: event.target.value }))}>
                  <option value="all">All technologies</option>
                  {technologies.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="projectspage-search"><span className="sr-only">Search projects</span><Search size={17} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setPreferences((previous) => ({ ...previous, query: event.target.value }))} placeholder="Search projects" /></label>
            </div>
            <div className="projectspage-view-switch" role="group" aria-label="Project display">
              {views.map(({ id, label, Icon }) => <button key={id} type="button" aria-pressed={view === id} aria-controls="projectspage-results" onClick={() => setPreferences((previous) => ({ ...previous, view: id }))}><Icon size={17} aria-hidden="true" /><span>{label}</span></button>)}
            </div>
          </div>
          <div className="projectspage-results-heading"><p>{resultsHeading}<span>{projects.length} {projects.length === 1 ? 'project' : 'projects'}</span></p><span>{view === 'gallery' ? 'A closer look at each build.' : 'The collection, at a glance.'}</span></div>
          <p className="sr-only" role="status">Showing {projects.length} {activeFilter.id === 'all' ? '' : activeFilter.label + ' '}{projects.length === 1 ? 'project' : 'projects'}{technology !== 'all' ? ' using ' + technology : ''}{query.trim() ? ' matching ' + query.trim() : ''}.</p>
          {projects.length > 0 ? <div id="projectspage-results" className={'projectspage-collection projectspage-collection-' + view}>{projects.map((project) => view === 'gallery' ? <GalleryProject project={project} key={project.slug} /> : <IndexProject project={project} key={project.slug} />)}</div> : <div id="projectspage-results" className="projectspage-empty"><p>No projects match these filters.</p><button type="button" onClick={clearFilters}><X size={15} aria-hidden="true" />Clear filters</button></div>}
          <div className="projectspage-collection-end"><span>That’s the collection. The learning continues.</span><a href={portfolio.github} target="_blank" rel="noreferrer">More on GitHub<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div>
        </section>

        <section className="projectspage-lab" data-reveal aria-labelledby="projectspage-lab-title"><div className="container projectspage-lab-inner"><div><span className="projectspage-section-label">A little less reading. A little more trying.</span><h2 id="projectspage-lab-title">Watch a<br />model learn.</h2><p>Step through a small binary-classification experiment in the learning lab.</p></div><Link to="/lab"><span>Enter the lab</span><ArrowRight size={36} aria-hidden="true" /></Link></div></section>
        <div className="projectspage-contact container" data-reveal><p>A project, an opportunity, or a question worth exploring?</p><Link to="/contact">Let’s talk<ArrowUpRight size={20} aria-hidden="true" /></Link></div>
      </main>
      <SiteFooter />
    </div>
  )
}

export default Projects
