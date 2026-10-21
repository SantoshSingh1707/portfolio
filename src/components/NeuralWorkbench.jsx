import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { portfolio } from '../data/mockData'
import NeuralRouter from './NeuralRouter'
import './anatomy/kit/iso.css'
import './NeuralWorkbench.css'

const MODES = [
  { label: 'Documents', tone: 'study', input: 'Source material', process: 'Retrieve & generate', output: 'Active revision', short: 'Study' },
  { label: 'Code', tone: 'review', input: 'Python source', process: 'Local inference', output: 'Structured review', short: 'Review' },
  { label: 'Data', tone: 'chart', input: 'Tabular data', process: 'Train & evaluate', output: 'Price prediction', short: 'Predict' },
  { label: 'Images', tone: 'vision', input: 'Visual evidence', process: 'Inspect model signals', output: 'Image analysis', short: 'Inspect' },
]

export default function NeuralWorkbench({ className = '' }) {
  const [selected, setSelected] = useState(0)
  const mode = MODES[selected]
  const project = portfolio.projects.find((item) => item.tone === mode.tone)

  return (
    <section className={`nw-workbench iso ${className}`} data-mode={selected} aria-label="Interactive project pathways">
      <div className="nw-toolbar">
        <div className="nw-intro"><span className="nw-signal" aria-hidden="true" /><span>Explore the project pathways</span></div>
        <div className="nw-modes" role="group" aria-label="Choose a project pathway">
          {MODES.map((item, index) => <button
            key={item.tone}
            type="button"
            aria-pressed={selected === index}
            className={`nw-mode${selected === index ? ' nw-mode--active' : ''}`}
            onClick={() => setSelected(index)}
          >
            <span className="nw-mode-number" aria-hidden="true">0{index + 1}</span>{item.label}
          </button>)}
        </div>
      </div>
      <div className="nw-layout">
        <NeuralRouter selected={selected} />
        <aside className="nw-inspector" key={selected} aria-live="polite" aria-atomic="true">
          <div className="nw-inspector-top"><span>Selected pathway</span><span className="nw-path-index">0{selected + 1} / 04</span></div>
          <div className="nw-project-category">{project?.category}</div>
          <h2 className="nw-project-title">{project?.title}</h2>
          <p className="nw-project-summary">{project?.summary}</p>
          <ol className="nw-pathway">
            <li><span className="nw-pathway-key">Input</span><span>{mode.input}</span></li>
            <li><span className="nw-pathway-key">Process</span><span>{mode.process}</span></li>
            <li><span className="nw-pathway-key">Output</span><span>{mode.output}</span></li>
          </ol>
          <Link className="nw-project-link" to={`/projects/${project?.slug}`}>Explore project<ArrowUpRight size={17} aria-hidden="true" /></Link>
        </aside>
      </div>
    </section>
  )
}
