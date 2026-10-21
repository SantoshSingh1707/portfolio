import { Link } from "@tanstack/react-router"
import { useEffect } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Briefcase, Code2, GraduationCap, MapPin, Plus } from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { usePageMotion } from '../hooks/usePageMotion'
import SkillConstellation from '../components/SkillConstellation'
import { portfolio } from '../data/mockData'
import portrait from '../assets/me.png'
import portraitAvif from '../assets/me.avif'
import portraitWebp from '../assets/me.webp'
import './AboutPage.css'

const journey = [
  portfolio.milestones.find((item) => item.label === 'Education'),
  portfolio.milestones.find((item) => item.label === 'Industry experience'),
].filter(Boolean)

const learningThreads = [
  { number: '01', label: 'RAG / learning tools', question: 'Can a generated note show where it came from?', text: 'The study-tool project turns course documents into source-first quizzes and notes.', slug: 'ai-study-tool' },
  { number: '02', label: 'Private inference', question: 'What makes a local code review useful and trustworthy?', text: 'The review-agent project keeps inference on-device and returns findings in structured categories.', slug: 'code-review-agent' },
  { number: '03', label: 'Reproducible ML', question: 'Can a model run be replayed, inspected, and compared?', text: 'The house-price pipeline uses ZenML and MLflow to organize and track experiments.', slug: 'house-price-model' },
  { number: '04', label: 'Computer vision', question: 'Does a detector generalize to images from new generators?', text: 'Cross-generator evaluation is a next research question noted in the TruthLens project.', slug: 'truthlens-ai' },
]

function About() {
  usePageMotion()
  useEffect(() => {
    const previousTitle = document.title
    const previousDescription = document.querySelector('meta[name="description"]')
    const description = previousDescription || document.createElement('meta')
    const previousContent = previousDescription?.getAttribute('content')
    if (!previousDescription) {
      description.setAttribute('name', 'description')
      document.head.appendChild(description)
    }
    document.title = `About ${portfolio.name} — AI/ML Student & Developer`
    description.setAttribute('content', 'Meet Santosh Singh, a Computer Science student at DIT Dehradun, Class of 2027. Explore his learning journey, data science experience, and AI/ML toolkit.')
    return () => {
      document.title = previousTitle
      if (!previousDescription) description.remove()
      else if (previousContent === null) description.removeAttribute('content')
      else description.setAttribute('content', previousContent)
    }
  }, [])

  return (
    <div className="aboutpage" id="top" data-page-motion>
      <a className="skip-link" href="#aboutpage-main">Skip to content</a>
      <SiteHeader />
      <main id="aboutpage-main" tabIndex={-1}>
        <section className="aboutpage-hero container" data-hero aria-labelledby="aboutpage-title">
          <div className="aboutpage-topline"><span>About / {portfolio.name}</span><span><MapPin size={13} aria-hidden="true" />{portfolio.location}</span></div>
          <div className="aboutpage-hero-grid">
            <div className="aboutpage-intro">
              <p className="aboutpage-kicker"><span aria-hidden="true" />The person behind the projects</p>
              <h1 id="aboutpage-title">The human<br />in the loop.</h1>
              <p className="aboutpage-hero-copy">An AI/ML student, a software builder, and someone who learns best by making things.</p>
              <div className="aboutpage-hero-links"><a className="aboutpage-resume" href={portfolio.resume} target="_blank" rel="noreferrer">Read my résumé<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a><a className="aboutpage-toolkit-jump" href="#toolkit">Explore my toolkit<ArrowDown size={16} aria-hidden="true" /></a></div>
              <div className="aboutpage-class"><span>B.Tech / Computer Science & Engineering</span><strong>CLASS OF 2027</strong></div>
            </div>
            <figure className="aboutpage-portrait">
              <div className="aboutpage-portrait-stage"><span className="aboutpage-portrait-year" aria-hidden="true">27</span><span className="aboutpage-portrait-orbit" aria-hidden="true" /><picture><source srcSet={portraitAvif} type="image/avif" /><source srcSet={portraitWebp} type="image/webp" /><img src={portrait} alt="Santosh Singh wearing his DIT hoodie" width="750" height="879" fetchPriority="high" decoding="async" /></picture><span className="aboutpage-portrait-plus" aria-hidden="true">+</span></div>
              <figcaption><span>{portfolio.name}</span><span>Student in progress.</span></figcaption>
            </figure>
          </div>
        </section>

        <section className="aboutpage-story" data-reveal aria-labelledby="aboutpage-story-title">
          <div className="container aboutpage-story-grid"><div><span className="aboutpage-section-label">A little context</span><h2 id="aboutpage-story-title">Student first.<br />Curiosity always.</h2></div><div className="aboutpage-story-copy"><p className="aboutpage-lead">I'm Santosh, studying Computer Science & Engineering at DIT in Dehradun.</p><p>I'm interested in the place where software meets machine learning. My projects explore how language models can work with personal documents, how inference can stay local, and how an experiment can become easier to reproduce.</p><p>Computer vision gives me another set of questions: what does a model see, and how can we understand the signals behind its prediction? I'm still learning, and building is how I work through those questions.</p><p>Alongside that work, I practice data structures and algorithms in Java. A different kind of problem, with the same habit of trying, reviewing, and trying again.</p></div></div>
        </section>

        <section className="aboutpage-learning" data-reveal aria-labelledby="aboutpage-learning-title">
          <div className="container aboutpage-learning-inner">
            <div className="aboutpage-learning-heading"><span className="aboutpage-section-label">Current questions</span><h2 id="aboutpage-learning-title">What I’m<br />exploring next.</h2><p>Questions that keep coming up across the work, with a project behind each one.</p><time dateTime="2026-10-20">Portfolio notes reviewed 20 Oct 2026</time></div>
            <ol className="aboutpage-learning-list">
              {learningThreads.map((thread) => {
                const project = portfolio.projects.find((item) => item.slug === thread.slug)
                return <li className="aboutpage-learning-item" key={thread.number}><span className="aboutpage-learning-number">{thread.number}</span><div><span className="aboutpage-learning-label">{thread.label}</span><h3>{thread.question}</h3><p>{thread.text}</p><Link to={'/projects/' + thread.slug}>Read {project?.title}<ArrowUpRight size={15} aria-hidden="true" /></Link></div></li>
              })}
            </ol>
          </div>
        </section>

        <section className="aboutpage-journey container" data-reveal aria-labelledby="aboutpage-journey-title">
          <div className="aboutpage-journey-heading"><span className="aboutpage-section-label">Education & experience</span><h2 id="aboutpage-journey-title">Where I'm<br />learning.</h2><p>Coursework, industry exposure, and the work in between.</p></div>
          <div className="aboutpage-timeline">{journey.map((item) => <article className="aboutpage-timeline-item" key={item.label}><div className="aboutpage-timeline-icon" aria-hidden="true">{item.label === 'Education' ? <GraduationCap size={22} /> : <Briefcase size={21} />}</div><div><div className="aboutpage-timeline-top"><span>{item.label}</span><span>{item.period}</span></div><h3>{item.title}</h3><p className="aboutpage-timeline-place">{item.place}</p><p>{item.detail}</p></div></article>)}</div>
        </section>

        <section className="aboutpage-practice" data-reveal aria-labelledby="aboutpage-practice-title"><div className="container aboutpage-practice-inner"><div className="aboutpage-practice-number">280<span>+</span></div><div className="aboutpage-practice-copy"><span className="aboutpage-section-label">Practice makes patterns</span><h2 id="aboutpage-practice-title">Problems solved.<br />More to figure out.</h2><p>Data structures and algorithms in Java, with practice across arrays, strings, hash tables, dynamic programming, and binary search.</p><a href="https://leetcode.com/u/santosh102969/" target="_blank" rel="noreferrer">Visit my LeetCode<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div><Code2 className="aboutpage-practice-mark" size={110} strokeWidth={.8} aria-hidden="true" /></div></section>

        <section className="aboutpage-toolkit container" data-reveal id="toolkit" aria-labelledby="aboutpage-toolkit-title"><div className="aboutpage-toolkit-heading"><span className="aboutpage-section-label">My working set</span><h2 id="aboutpage-toolkit-title">Tools for<br />the questions.</h2><p>Languages, libraries, and systems I've used across coursework and projects. Open a group to take a closer look.</p><span className="aboutpage-toolkit-note"><span aria-hidden="true">+</span> Always a work in progress.</span></div><div className="aboutpage-skill-list">{portfolio.skills.map((group, index) => <details className="aboutpage-skill-group" key={group.title} open={index === 0}><summary><span>{group.title}</span><span className="aboutpage-skill-count">{group.items.length} skills</span><Plus size={22} aria-hidden="true" /></summary><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></details>)}</div><SkillConstellation groups={portfolio.skills} /></section>

        <section className="aboutpage-next container" data-reveal aria-labelledby="aboutpage-next-title"><div className="aboutpage-next-heading"><span className="aboutpage-section-label">Keep exploring</span><h2 id="aboutpage-next-title">See the questions<br />turn into code.</h2></div><div className="aboutpage-next-links"><Link to="/projects"><span>Selected projects<small>Language, vision, and model workflows.</small></span><ArrowUpRight size={24} aria-hidden="true" /></Link><Link to="/lab"><span>The learning lab<small>A small experiment you can try.</small></span><ArrowUpRight size={24} aria-hidden="true" /></Link></div></section>
        <section className="aboutpage-contact" data-reveal><div className="container"><p>Have a project, an opportunity, or a good question?</p><Link to="/contact"><span>Let's talk.</span><ArrowRight size={55} aria-hidden="true" /></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  )
}

export default About
