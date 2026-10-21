import { Link } from "@tanstack/react-router"
import { useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import ModelPlayground from '../components/ModelPlayground'
import { usePageMotion } from '../hooks/usePageMotion'
import './Lab.css'

export default function Lab() {
  usePageMotion()
  useEffect(() => {
    document.title = 'Lab — Santosh Singh'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'An interactive machine-learning lab by Santosh Singh. Train a classifier, change the dataset and learning rate, and explore decision boundaries.')
  }, [])

  return (
    <div className="site-shell lab-page" id="top" data-page-motion><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main" tabIndex={-1}>
      <section className="lab-intro container" data-hero aria-labelledby="lab-title"><div><p className="lab-page-label"><span />The lab / a working study</p><h1 id="lab-title">The experiment<br />is the point.</h1></div><div className="lab-intro-copy"><p>Change an input. Follow the result. Get a little closer to understanding what a model is doing.</p><a href="#classifier">Try the classifier<ArrowUpRight size={19} /></a><span>Interactive experiments, built for learning.</span></div></section>
      <ModelPlayground />
      <section className="lab-notes container" data-reveal aria-labelledby="lab-notes-title"><div className="lab-notes-heading"><span className="lab-page-label">Under the surface</span><h2 id="lab-notes-title">A small model.<br />A few big ideas.</h2><p>This experiment uses logistic regression. Its simplicity makes the moving parts visible.</p></div><div className="lab-explanations"><details open><summary>What is the model learning?</summary><p>Two weights and a bias. Each training step uses the difference between the model’s probability and the sample’s label to adjust those parameters. The dashed line marks a probability of 0.5.</p></details><details><summary>Why does XOR get stuck?</summary><p>Logistic regression draws a straight boundary. XOR puts the same class in opposite corners, so a single straight line cannot separate the classes. More training cannot fix that limitation.</p></details><details><summary>What does the learning rate change?</summary><p>It controls how far the parameters move on each gradient step. A smaller rate moves cautiously; a larger rate makes bigger updates. The loss readout shows how the current parameters fit the current samples.</p></details></div></section>
      <section className="lab-next container" data-reveal><div><span className="lab-page-label">Beyond the toy model</span><h2>See the ideas<br />inside the projects.</h2></div><Link className="button button-primary" to="/projects">Explore the projects<ArrowUpRight size={18} /></Link></section>
    </main><SiteFooter /></div>
  )
}
