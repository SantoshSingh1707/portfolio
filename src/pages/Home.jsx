import { useEffect, useState, useRef, useCallback } from 'react'
import { ArrowDownRight, ArrowUpRight, ExternalLink, Mail, Menu, X } from 'lucide-react'
import CursorEffect from '../components/CursorEffect'
import profileAsset from '../assets/me.png'
import './Home.css'

const projects = [
  { index: '01', category: 'RAG', type: 'RAG / PRODUCT', title: 'AI STUDY TOOL', detail: 'A full-stack learning companion that turns PDFs, DOCX, and PPTX files into quizzes, flashcards, and study notes.', tags: 'PYTHON \u00b7 FASTAPI \u00b7 REACT \u00b7 LANGCHAIN', tone: 'project-lime', github: 'https://github.com/SantoshSingh1707/AI-Study-Tool', slug: 'ai-study-tool' },
  { index: '02', category: 'Agents', type: 'LOCAL AI / AGENT', title: 'CODE REVIEW AGENT', detail: 'A privacy-first CodeLlama agent that finds bugs, security issues, performance gaps, and best-practice violations.', tags: 'PYTHON \u00b7 OLLAMA \u00b7 CODELLAMA \u00b7 PYTEST', tone: 'project-orange', github: 'https://github.com/SantoshSingh1707/code-review-agent', slug: 'code-review-agent' },
  { index: '03', category: 'MLOps', type: 'MLOPS / PIPELINE', title: 'HOUSE PRICE MODEL', detail: 'A reproducible machine-learning pipeline with tracked experiments, model versions, and evaluation stages.', tags: 'PYTHON \u00b7 ZENML \u00b7 MLFLOW', tone: 'project-blue', github: 'https://github.com/SantoshSingh1707/House-price-prediction-end-to-end-project', slug: 'house-price-model' },
  { index: '04', category: 'Computer Vision', type: 'COMPUTER VISION', title: 'TRUTHLENS AI', detail: 'An explainable image-analysis direction for distinguishing real, generated, and manipulated images.', tags: 'TENSORFLOW \u00b7 EFFICIENTNET \u00b7 VIT \u00b7 FFT', tone: 'project-red', github: 'https://github.com/SantoshSingh1707/AI-Image-Detection', slug: 'truthlens-ai' },
]
const projectFilters = ['All', 'RAG', 'Agents', 'MLOps', 'Computer Vision']
const navItems = [
  { id: 'top', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'projects', label: 'PROJECTS & WORK' },
  { id: 'contact', label: 'CONTACT ME' },
]

const marqueeText = 'RETRIEVAL \u00d7 GENERATION \u00d7 EXPERIMENTATION \u00d7 DELIVERY \u00d7'
const skillText = 'PYTHON \u00b7 JAVA \u00b7 TENSORFLOW \u00b7 KERAS \u00b7 SCIKIT-LEARN \u00b7 PANDAS \u00b7 OPENCV \u00b7 FASTAPI \u00b7 REACT \u00b7 LANGCHAIN \u00b7 MLFLOW \u00b7 ZENML \u00b7 DOCKER \u00b7 OLLAMA'
const skillTrack = `${skillText} \u00b7 ${skillText} \u00b7`

function useAnimatedCounter(target, duration = 1200) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) setStarted(true)
    }, { threshold: 0.5 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return undefined
    const num = parseInt(target.replace(/\D/g, ''), 10)
    if (Number.isNaN(num)) { setCount(target); return undefined }
    const startTime = performance.now()
    const step = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * num))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
    return undefined
  }, [started, target, duration])

  return { ref, display: started ? count : 0 }
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeSection, setActiveSection] = useState('top')
  const [modalClosing, setModalClosing] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [headerSection, setHeaderSection] = useState('section-hero')
  const [filterTransitioning, setFilterTransitioning] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [logoCopied, setLogoCopied] = useState(false)
  const [expandingCard, setExpandingCard] = useState(null)
  const cardGridRef = useRef(null)
  const profileRef = useRef(null)

  const stat280 = useAnimatedCounter('280')
  const stat2026 = useAnimatedCounter('2026')
  const stat17 = useAnimatedCounter('17')

  const closeModal = () => {
    setModalClosing(true)
    setTimeout(() => { setActiveProject(null); setModalClosing(false) }, 280)
  }

  const handleCardClick = (project) => {
    setExpandingCard(project.index)
    setTimeout(() => { setActiveProject(project); setExpandingCard(null) }, 250)
  }

  const handleLogoCopy = () => {
    navigator.clipboard.writeText('santosh102969@gmail.com').then(() => {
      setLogoCopied(true)
      setTimeout(() => setLogoCopied(false), 1800)
    }).catch(() => {})
  }

  const handleFilter = useCallback((filter) => {
    if (filter === activeFilter) return
    setFilterTransitioning(true)
    setTimeout(() => { setActiveFilter(filter); setFilterTransitioning(false) }, 180)
  }, [activeFilter])

  useEffect(() => {
    // 1. Preloader
    const preloaderTimer = setTimeout(() => setPreloaderDone(true), 1400)

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') { closeModal(); setMenuOpen(false) }
    }
    window.addEventListener('keydown', closeOnEscape)

    const handleScroll = () => {
      const scrollY = window.scrollY

      // 2. Scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0)

      // 4. Back-to-top visibility
      setShowBackToTop(scrollY > window.innerHeight * 0.6)

      // Section tracking
      if (scrollY < 120) {
        setActiveSection('top')
        setHeaderSection('section-hero')
        return
      }

      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
        setActiveSection('contact')
        setHeaderSection('section-contact')
        return
      }

      const sections = [
        { id: 'contact', navId: 'contact', headerClass: 'section-contact' },
        { id: 'experience', navId: 'projects', headerClass: 'section-experience' },
        { id: 'projects', navId: 'projects', headerClass: 'section-projects' },
        { id: 'about', navId: 'about', headerClass: 'section-about' },
      ]

      const triggerPosition = scrollY + window.innerHeight * 0.35

      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el && triggerPosition >= el.offsetTop) {
          setActiveSection(section.navId)
          setHeaderSection(section.headerClass)
          return
        }
      }

      setActiveSection('top')
      setHeaderSection('section-hero')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 })
    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((element) => revealObserver.observe(element))
    requestAnimationFrame(() => revealElements.forEach((element) => {
      const bounds = element.getBoundingClientRect()
      if (bounds.top < window.innerHeight && bounds.bottom > 0) element.classList.add('is-visible')
    }))

    // 6. Parallax on hero portrait
    const handleParallax = () => {
      if (!profileRef.current) return
      const scrollY = window.scrollY
      const rate = scrollY * 0.12
      profileRef.current.style.transform = `translateX(-50%) translateY(${rate}px)`
    }
    window.addEventListener('scroll', handleParallax, { passive: true })

    // 10. Mouse-follow tilt on project cards
    const handleCardMouseMove = (e) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const artEl = card.querySelector('.board-art')
      if (artEl) {
        artEl.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(12px)`
      }
    }
    const handleCardMouseLeave = (e) => {
      const artEl = e.currentTarget.querySelector('.board-art')
      if (artEl) artEl.style.transform = 'translateZ(12px)'
    }
    if (cardGridRef.current) {
      cardGridRef.current.querySelectorAll('.project-board').forEach((card) => {
        card.addEventListener('mousemove', handleCardMouseMove)
        card.addEventListener('mouseleave', handleCardMouseLeave)
      })
    }

    return () => {
      clearTimeout(preloaderTimer)
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleParallax)
      revealObserver.disconnect()
      if (cardGridRef.current) {
        cardGridRef.current.querySelectorAll('.project-board').forEach((card) => {
          card.removeEventListener('mousemove', handleCardMouseMove)
          card.removeEventListener('mouseleave', handleCardMouseLeave)
        })
      }
    }
  }, [])

  // Re-attach card tilt handlers when filter changes
  useEffect(() => {
    if (!cardGridRef.current) return undefined
    const handleCardMouseMove = (e) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const artEl = card.querySelector('.board-art')
      if (artEl) {
        artEl.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(12px)`
      }
    }
    const handleCardMouseLeave = (e) => {
      const artEl = e.currentTarget.querySelector('.board-art')
      if (artEl) artEl.style.transform = 'translateZ(12px)'
    }
    const cards = cardGridRef.current.querySelectorAll('.project-board')
    cards.forEach((card) => {
      card.addEventListener('mousemove', handleCardMouseMove)
      card.addEventListener('mouseleave', handleCardMouseLeave)
    })
    return () => {
      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleCardMouseMove)
        card.removeEventListener('mouseleave', handleCardMouseLeave)
      })
    }
  }, [activeFilter])

  const visibleProjects = activeFilter === 'All' ? projects : projects.filter((project) => project.category === activeFilter)

  const currentYear = new Date().getFullYear()

  return (
    <main className="stitch-home" id="top">
      <div className={`preloader ${preloaderDone ? 'is-hidden' : ''}`} aria-hidden="true"><div className="preloader-inner"><div className="preloader-logo">SS<span>/</span>26</div><div className="preloader-bar"><div className="preloader-bar-fill" /></div></div></div>
      <CursorEffect />
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <button className={`back-to-top ${showBackToTop ? 'is-visible' : ''}`} type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowDownRight size={18} style={{ transform: 'rotate(135deg)' }} /></button>
      <header className={`stitch-header ${headerSection}`}><a className="stitch-logo" href="#top" onClick={(e) => { e.preventDefault(); handleLogoCopy() }}>SS<span>/</span>26<span className={`copy-toast ${logoCopied ? 'is-visible' : ''}`}>EMAIL COPIED!</span></a><nav className="landing-links">{navItems.map((item) => (<a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? 'is-active' : ''} onClick={() => setActiveSection(item.id)}>{item.label}</a>))}</nav><a className="landing-resume" href="/resume.pdf" download>{'\u2193'} &nbsp; RESUME / CV</a><span className="header-avatar" aria-hidden="true">S</span><button className="stitch-menu-button" type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={22} /></button></header>
      <nav className={`stitch-drawer ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation"><button className="drawer-close" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={22} /></button><span>INDEX / SANTOSH SINGH</span>{[{ id: 'about', label: 'about' }, { id: 'projects', label: 'projects' }, { id: 'experience', label: 'experience' }, { id: 'contact', label: 'contact' }].map((item) => (<a key={item.id} href={`#${item.id}`} className={activeSection === item.id || (item.id === 'experience' && activeSection === 'projects') ? 'is-active' : ''} onClick={() => { setActiveSection(item.id === 'experience' ? 'projects' : item.id); setMenuOpen(false) }}>{item.label}</a>))}</nav>

      <section className="stitch-hero landing-hero manifesto-hero"><div className="hero-title-wrap"><p className="stitch-kicker">SANTOSH SINGH / DATA SCIENCE & AI</p><h1>I BUILD<br /><em>USEFUL</em><br />INTELLIGENCE.</h1><p className="hero-statement">Computer Science & Engineering student at Dehradun Institute of Technology. I turn messy data and ambitious ideas into practical AI products.</p><div className="manifesto-actions"><a className="text-link" href="#projects">VIEW MY WORK <ArrowUpRight size={15} /></a><a className="text-link" href="mailto:santosh102969@gmail.com">GET IN TOUCH <ArrowUpRight size={15} /></a></div></div><div className="profile-portrait" ref={profileRef}><img src={profileAsset} alt="Santosh Singh" /></div><a className="hero-scroll" href="#projects"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={18} /></a></section>

      <section className="stitch-intro reveal" id="about"><div className="section-number">01 / ABOUT</div><div className="intro-copy"><p className="stitch-kicker">A student of systems</p><h2>Turning <em>complex</em><br />ideas into clear tools.</h2><p>I am a Computer Science & Engineering student at Dehradun Institute of Technology focused on machine learning, NLP, generative AI, and the craft of making technical work useful.</p><div className="download-links"><a className="text-link" href="/resume.pdf" download>DOWNLOAD RESUME <ArrowUpRight size={15} /></a><a className="text-link" href="/Santosh's_Certificate.pdf" download>DOWNLOAD CERTIFICATE <ArrowUpRight size={15} /></a></div></div><div className="intro-facts"><div ref={stat280.ref}><strong>{stat280.display}+</strong><span>LeetCode problems</span></div><div ref={stat2026.ref}><strong>{stat2026.display}</strong><span>Celebal data science intern</span></div><div ref={stat17.ref}><strong>{stat17.display}</strong><span>Tools in practice</span></div></div></section>

      <section className="stitch-projects reveal" id="projects"><div className="section-number">02 / SELECTED WORK</div><div className="projects-heading"><h2>SELECTED<br /><i>EXPERIMENTS</i></h2><p>Four projects from a growing practice in applied AI. Filter by discipline or inspect a board for more detail.</p></div><div className="project-filters" role="group" aria-label="Filter projects">{projectFilters.map((filter) => <button className={activeFilter === filter ? 'project-filter is-active' : 'project-filter'} type="button" key={filter} onClick={() => handleFilter(filter)} aria-pressed={activeFilter === filter}>{filter}</button>)}</div><div className={`project-wall ${filterTransitioning ? 'filtering' : ''}`} ref={cardGridRef}>{visibleProjects.map((project) => <article className={`project-board ${project.tone} ${expandingCard === project.index ? 'expanding' : ''}`} key={project.index}><button className="board-hit" type="button" onClick={() => handleCardClick(project)}><div className="board-top"><span>{project.index}</span><span>{project.type}</span><ArrowUpRight size={17} /></div><div className="board-art"><span>{project.index}</span><b>{project.title}</b><div className="art-lines" /></div><div className="board-bottom"><h3>{project.title}</h3><p>{project.detail}</p><small>{project.tags}</small></div></button><div className="board-actions"><a className="board-link" href={project.github} target="_blank" rel="noreferrer">VIEW GITHUB <ExternalLink size={13} /></a><a className="board-link" href={`/projects/${project.slug}`}>OPEN CASE STUDY <ArrowUpRight size={13} /></a></div></article>)}</div></section>

      <section className="stitch-marquee reveal" aria-label="Capabilities"><div><span>{marqueeText}</span><span>{marqueeText}</span></div></section>

      <section className="stitch-experience reveal" id="experience"><div className="section-number">03 / EXPERIENCE</div><div className="experience-layout"><div><p className="stitch-kicker">What I am learning by doing</p><h2>FROM DATA<br /><i>TO DECISIONS.</i></h2></div><div className="timeline reveal"><article><span>JUN\u2014AUG / 2026</span><h3>CELEBAL TECHNOLOGIES</h3><p>Celebal Excellence Intern \u2014 Data Science. An industry-focused program combining guided learning, mentorship, and hands-on work on real-world data science use cases.</p></article><article><span>2023\u20142027</span><h3>DEHRADUN INSTITUTE OF TECHNOLOGY</h3><p>B.Tech, Computer Science & Engineering. Coursework across data analysis, software engineering, operating systems, algorithms, and artificial intelligence.</p></article></div></div><div className="skill-ticker"><div className="skill-ticker-track"><span>{skillTrack}</span></div></div></section>

      <section className="stitch-contact reveal" id="contact"><div className="section-number">04 / CONTACT</div><div className="contact-layout"><div><h2>HAVE A<br /><i>GOOD IDEA?</i></h2></div><div className="contact-details"><p>Open to internships, early-career roles, and thoughtful collaborations in data science, machine learning, and generative AI.</p><a href="mailto:santosh102969@gmail.com" className="contact-email">santosh102969@gmail.com <ArrowUpRight size={19} /></a><a href="tel:+918347735836" className="contact-phone">+91 8347735836</a><div className="social-links"><a href="https://github.com/SantoshSingh1707" target="_blank" rel="noreferrer">GITHUB <ExternalLink size={13} /></a><a href="https://www.linkedin.com/in/santosh-singh-a6ab972a0" target="_blank" rel="noreferrer">LINKEDIN <ExternalLink size={13} /></a><a href="https://leetcode.com/u/santosh102969/" target="_blank" rel="noreferrer">LEETCODE <ExternalLink size={13} /></a></div></div></div><footer><span>{'\u00a9'} SANTOSH SINGH / {currentYear}</span><span>MADE WITH CURIOSITY</span><Mail size={17} /></footer></section>

      {activeProject && <div className={`project-modal-backdrop ${!modalClosing ? 'is-open' : ''}`} role="presentation" onClick={closeModal}><article className={`project-modal ${!modalClosing ? 'is-open' : ''} ${modalClosing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={closeModal}>CLOSE <X size={16} /></button><span className="stitch-kicker">{activeProject.index} / {activeProject.type}</span><h2 id="project-modal-title">{activeProject.title}</h2><p>{activeProject.detail}</p><small>{activeProject.tags}</small><a className="text-link" href="https://github.com/SantoshSingh1707" target="_blank" rel="noreferrer">VIEW GITHUB <ArrowUpRight size={15} /></a><div className="modal-keyboard-hint">ESC TO CLOSE</div></article></div>}

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{navItems.map((item) => <a key={item.id} href={`#${item.id}`} className={activeSection === item.id ? 'is-active' : ''} onClick={() => setActiveSection(item.id)}>{item.label}</a>)}</nav>
    </main>
  )
}

export default Home
