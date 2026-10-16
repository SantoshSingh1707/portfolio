import {
  ArrowRight, BookOpen, Check, ChevronRight, Code2, FileText,
  Image, Layers, LockKeyhole, MoreHorizontal, ScanLine, Search,
  ShieldCheck, Terminal,
} from 'lucide-react'
import './ProjectVisual.css'

function WindowBar({ name, dark = false, children }) {
  return (
    <div className={`pv-window-bar${dark ? ' pv-window-bar-dark' : ''}`}>
      <span className="pv-window-dots"><i /><i /><i /></span>
      <span className="pv-window-name">{name}</span>
      {children || <MoreHorizontal size={14} />}
    </div>
  )
}

function NeuralGlyph() {
  return <svg className="pv-neural-glyph" viewBox="0 0 64 48" fill="none"><path d="M8 8 32 8M8 8 32 24M8 8 32 40M8 24 32 8M8 24 32 24M8 24 32 40M8 40 32 8M8 40 32 24M8 40 32 40M32 8 56 16M32 8 56 32M32 24 56 16M32 24 56 32M32 40 56 16M32 40 56 32" stroke="currentColor" strokeOpacity=".35" strokeWidth=".8" />{[[8, 8], [8, 24], [8, 40], [32, 8], [32, 24], [32, 40], [56, 16], [56, 32]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="#F2EEE6" stroke="currentColor" strokeWidth="1.2" />)}</svg>
}

function StudyPreview() {
  return (
    <div className="pv-app pv-study-app">
      <WindowBar name="Study space" />
      <div className="pv-study-layout">
        <aside className="pv-study-sidebar">
          <span className="pv-app-brand"><span className="pv-mini-logo"><BookOpen /></span>Study tool</span>
          <span className="pv-nav-selected"><Layers /> My library</span>
          <span className="pv-sidebar-caption">Your material</span>
          <span className="pv-document-link"><FileText /><span>Neural networks.pdf<small>Document source</small></span></span>
          <div className="pv-rag-flow"><span className="pv-rag-heading">Retrieval pipeline</span><span><i />Source files</span><span><i />Embeddings</span><span><i />Retrieved context</span></div>
          <span className="pv-sidebar-foot"><span className="pv-status-dot" /> Source grounded</span>
        </aside>
        <div className="pv-study-main">
          <div className="pv-content-heading"><div><span className="pv-mini-caption">Your next study session</span><h4>Make it click.</h4></div><span className="pv-square-icon"><NeuralGlyph /></span></div>
          <div className="pv-study-tabs"><span>Flashcards</span><span>Quiz</span><span>Notes</span></div>
          <div className="pv-flashcard-shadow" />
          <div className="pv-flashcard">
            <span className="pv-card-subtitle"><BookOpen /> Neural networks</span>
            <strong>How does a neural<br />network learn?</strong>
            <span className="pv-card-rule" />
            <span className="pv-card-answer">By adjusting its weights<br />using feedback from an error.</span>
            <span className="pv-source-chip"><FileText /> From your document</span>
          </div>
          <div className="pv-study-bottom"><span>One idea at a time</span><span className="pv-next-card">Next card <ArrowRight /></span></div>
        </div>
      </div>
    </div>
  )
}

function ReviewPreview() {
  return (
    <div className="pv-app pv-review-app">
      <WindowBar name="Code review agent" dark><span className="pv-local-label"><LockKeyhole /> CodeLlama / local</span></WindowBar>
      <div className="pv-editor-toolbar"><span><Code2 /> review.py <i /></span><span>Python <ChevronRight /></span></div>
      <div className="pv-review-layout">
        <div className="pv-code-pane">
          <div className="pv-code-line"><i>1</i><code><b>def</b> <em>load_records</em>(path):</code></div>
          <div className="pv-code-line"><i>2</i><code>  file = <em>open</em>(path)</code></div>
          <div className="pv-code-line"><i>3</i><code>  records = []</code></div>
          <div className="pv-code-line pv-code-highlight"><i>4</i><code>  <b>for</b> line <b>in</b> file:</code></div>
          <div className="pv-code-line"><i>5</i><code>    records.append(line)</code></div>
          <div className="pv-code-line"><i>6</i><code>  <b>return</b> records</code></div>
          <div className="pv-code-line"><i>7</i><code>&nbsp;</code></div>
          <div className="pv-code-line"><i>8</i><code className="pv-code-comment"># A second pair of eyes.</code></div>
          <div className="pv-code-status"><Terminal /> Ollama / CodeLlama<span className="pv-status-dot" /></div>
        </div>
        <aside className="pv-review-panel">
          <span className="pv-review-title"><ShieldCheck /> Review notes</span>
          <div className="pv-review-finding"><span className="pv-finding-type">Resource handling</span><strong>Close the file safely</strong><p>A context manager releases the file, even if an error occurs.</p><span className="pv-inline-code">with open(path) as file:</span></div>
          <div className="pv-review-check"><Check /> Structured feedback</div>
          <div className="pv-review-check"><LockKeyhole /> Code stays on device</div>
        </aside>
      </div>
    </div>
  )
}

function HouseGlyph() {
  return <svg className="pv-house-glyph" viewBox="0 0 52 52" fill="none"><path d="M7 25 26 8l19 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 22v23h28V22" fill="#F2EEE6" stroke="currentColor" strokeWidth="2" /><path d="M22 45V31h9v14" fill="#FF6B35" /><path d="M16 27h4v5h-4zm18 0h4v5h-4z" fill="currentColor" /></svg>
}

function ChartPreview() {
  return (
    <div className="pv-app pv-chart-app">
      <WindowBar name="House price experiments" />
      <div className="pv-dashboard">
        <div className="pv-dashboard-heading"><span className="pv-dashboard-icon"><HouseGlyph /></span><div><span className="pv-mini-caption">House price prediction</span><h4>Data. Train. Evaluate.</h4></div><span className="pv-dashboard-menu"><MoreHorizontal /></span></div>
        <div className="pv-pipeline"><span><i><Check /></i>Ingest</span><ChevronRight /><span><i><Check /></i>Prepare</span><ChevronRight /><span><i><Check /></i>Train</span><ChevronRight /><span className="pv-pipeline-active"><i><Layers /></i>Evaluate</span></div>
        <div className="pv-dashboard-grid">
          <div className="pv-chart-panel"><div className="pv-chart-heading"><strong>Experiment comparison</strong><span><i /> Model runs</span></div>
            <svg className="pv-line-chart" viewBox="0 0 300 118" preserveAspectRatio="none">
              <path className="pv-grid-line" d="M8 20H292M8 48H292M8 76H292M8 104H292M8 12V105M78 12V105M149 12V105M220 12V105M291 12V105" />
              <path className="pv-chart-fill" d="M9 92C37 88 43 65 70 70S112 43 140 49S182 27 211 33S257 14 290 19V105H9Z" />
              <path className="pv-chart-secondary" d="M9 97C38 97 41 85 70 83S113 71 140 74S183 53 211 57S257 43 290 46" />
              <path className="pv-chart-primary" d="M9 92C37 88 43 65 70 70S112 43 140 49S182 27 211 33S257 14 290 19" />
              <circle cx="211" cy="33" r="4.5" fill="#FF6B35" stroke="#F2EEE6" strokeWidth="3" />
            </svg>
            <div className="pv-chart-axis"><span>Earlier runs</span><span>Illustrative trend</span><span>Recent runs</span></div>
          </div>
          <div className="pv-run-panel"><span className="pv-mini-caption">MLflow experiment log</span><strong>Every step,<br />accounted for.</strong><div><span className="pv-status-dot" /> Data version</div><div><span className="pv-status-dot" /> Parameters</div><div><span className="pv-status-dot" /> Model artifacts</div><span className="pv-mlflow-pill">Tracked with MLflow</span></div>
        </div>
      </div>
    </div>
  )
}

function Landscape({ analysis = false }) {
  return <div className={`pv-landscape${analysis ? ' pv-landscape-analysis' : ''}`}><span className="pv-landscape-sun" /><span className="pv-mountain-back" /><span className="pv-mountain-front" /><span className="pv-landscape-water" />{analysis && <><span className="pv-scan-box pv-scan-box-one" /><span className="pv-scan-box pv-scan-box-two" /><span className="pv-scan-cross" /></>}</div>
}

function VisionPreview() {
  return (
    <div className="pv-app pv-vision-app">
      <WindowBar name="TruthLens AI" />
      <div className="pv-vision-content">
        <div className="pv-vision-heading"><span className="pv-vision-brand"><ScanLine />TruthLens<span>AI</span></span><span className="pv-vision-file"><Image /> landscape.png</span></div>
        <div className="pv-image-pair"><div className="pv-image-tile"><Landscape /><span>Source image <Image /></span></div><div className="pv-image-tile"><Landscape analysis /><span>Grad-CAM overlay <ScanLine /></span></div></div>
        <div className="pv-forensics-row"><div className="pv-spectrum"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="pv-forensics-copy"><strong>Look beyond the label.</strong><span>FFT spectrum + model explanations</span></div><span className="pv-forensics-arrow"><Search /></span><div className="pv-signal-tiles" aria-hidden="true"><i /><i /><i /><i /></div></div>
      </div>
    </div>
  )
}

const previews = { study: StudyPreview, review: ReviewPreview, chart: ChartPreview, vision: VisionPreview }

const treatments = {
  study: { Icon: BookOpen, glyph: 'Aa', paper: 'Learning notes', caption: 'A little revision.', title: 'A lot more clarity.' },
  review: { Icon: LockKeyhole, glyph: '{ }', paper: 'review.py', caption: 'Your code.', title: 'Your machine.' },
  chart: { Icon: Layers, glyph: '↗', paper: 'Experiment notebook', caption: 'One experiment.', title: 'A clearer next step.' },
  vision: { Icon: ScanLine, glyph: '+', paper: 'Image evidence', caption: 'Look closer.', title: 'Question the pixels.' },
}

export default function ProjectVisual({ tone = 'study' }) {
  const Preview = previews[tone] || StudyPreview
  const { Icon, glyph, paper, caption, title } = treatments[tone] || treatments.study
  return (
    <div className={`pv-scene pv-scene-${tone}`} aria-hidden="true">
      {tone === 'study' ? <img className="pv-real-project-frame" src="/images/studybench-frame.webp" alt="" /> : <>
      <div className="pv-backdrop"><span className="pv-backdrop-disc" /><span className="pv-backdrop-glyph">{glyph}</span><span className="pv-paper-sheet"><span>{paper}</span><i /><i /><i /><i /><i /></span></div>
      <span className="pv-concept-label"><span />Concept preview</span>
      <Preview />
      <span className="pv-floating-note"><span className="pv-floating-icon"><Icon /></span><span>{caption}<strong>{title}</strong></span></span>
      <span className="pv-regmarks" />
      </>}
    </div>
  )
}
