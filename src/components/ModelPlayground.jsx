import { lazy, Suspense, useCallback, useEffect, useId, useState } from 'react'
import { ArrowRight, Box, ChartNoAxesColumnIncreasing, Plus, RotateCcw } from 'lucide-react'
import './ModelPlayground.css'

const ProbabilitySurface3D = import.meta.env.SSR
  ? null
  : lazy(() => import('./ProbabilitySurface3D'))

const presets = {
  linear: [
    [-.82,-.72,0],[-.62,-.88,0],[-.75,-.21,0],[-.42,-.45,0],[-.18,-.77,0],[-.36,-.12,0],[-.84,.15,0],[.07,-.43,0],
    [.23,.52,1],[.52,.73,1],[.81,.38,1],[.65,.04,1],[.18,.87,1],[-.08,.43,1],[.89,.83,1],[.4,.2,1],
  ],
  xor: [
    [-.8,-.8,1],[-.6,-.7,1],[-.7,-.5,1],[-.5,-.6,1],[.8,.8,1],[.6,.7,1],[.7,.5,1],[.5,.6,1],
    [-.8,.8,0],[-.6,.7,0],[-.7,.5,0],[-.5,.6,0],[.8,-.8,0],[.6,-.7,0],[.7,-.5,0],[.5,-.6,0],
  ],
}
const initialModel = { weights: [-.6,.15], bias: .6, step: 0 }
const sigmoid = (value) => 1 / (1 + Math.exp(-value))
const probability = (model,x,y) => sigmoid(model.weights[0]*x + model.weights[1]*y + model.bias)
const copySamples = (key) => presets[key].map((sample) => [...sample])

function train(model,samples,learningRate) {
  const weights = [...model.weights]
  let bias = model.bias
  for (let iteration=0; iteration<25; iteration++) {
    const gradient = [0,0,0]
    samples.forEach(([x,y,label]) => {
      const error = sigmoid(weights[0]*x + weights[1]*y + bias) - label
      gradient[0] += error*x
      gradient[1] += error*y
      gradient[2] += error
    })
    weights[0] -= learningRate*gradient[0]/samples.length
    weights[1] -= learningRate*gradient[1]/samples.length
    bias -= learningRate*gradient[2]/samples.length
  }
  return { weights, bias, step: model.step+25 }
}

export default function ModelPlayground() {
  const [preset,setPreset] = useState('linear')
  const [samples,setSamples] = useState(() => copySamples('linear'))
  const [model,setModel] = useState(initialModel)
  const [learningRate,setLearningRate] = useState(.7)
  const [showBoundary,setShowBoundary] = useState(true)
  const [view,setView] = useState('2d')
  const [webglAvailable,setWebglAvailable] = useState(false)
  const [point,setPoint] = useState({ x: '0.3', y: '-0.2', label: '1' })
  const [sampleMessage,setSampleMessage] = useState('')
  const id = useId().replaceAll(':','')
  const returnToMap = useCallback(() => setView('2d'), [])

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('webgl')
      setWebglAvailable(Boolean(context))
      context?.getExtension('WEBGL_lose_context')?.loseContext()
      const smallScreen = window.matchMedia('(max-width: 700px)')
      const chooseAccessibleView = () => { if (smallScreen.matches) setView('2d') }
      smallScreen.addEventListener('change', chooseAccessibleView)
      chooseAccessibleView()
      return () => smallScreen.removeEventListener('change', chooseAccessibleView)
    } catch {
      setWebglAvailable(false)
    }
  }, [])

  function choosePreset(key) {
    setPreset(key)
    setSamples(copySamples(key))
    setModel(initialModel)
    setSampleMessage('')
  }

  function reset() {
    choosePreset(preset)
    setLearningRate(.7)
    setShowBoundary(true)
    setPoint({ x: '0.3', y: '-0.2', label: '1' })
  }

  function addSample(event) {
    event.preventDefault()
    const x = Number(point.x)
    const y = Number(point.y)
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x)>1 || Math.abs(y)>1 || samples.length>=48) return
    setSamples((previous) => [...previous,[x,y,Number(point.label)]])
    setSampleMessage(`Added a Class ${point.label === '0' ? 'A' : 'B'} sample at (${x}, ${y}).`)
  }

  const loss = -samples.reduce((sum,[x,y,label]) => {
    const p = Math.max(1e-8,Math.min(1-1e-8,probability(model,x,y)))
    return sum+label*Math.log(p)+(1-label)*Math.log(1-p)
  },0)/samples.length
  const px = (value) => 35+(value+1)*165
  const py = (value) => 285-(value+1)*125
  const lineY = (x) => -(model.weights[0]*x+model.bias)/(Math.abs(model.weights[1])<1e-8 ? 1e-8 : model.weights[1])
  const cells = []
  for (let row=0; row<20; row++) {
    for (let col=0; col<26; col++) {
      const p = probability(model,-1+(col+.5)*2/26,1-(row+.5)*2/20)
      const alpha = (.035 + p * .55).toFixed(3)
      cells.push(<rect key={`${row}-${col}`} x={35+col*330/26} y={35+row*12.5} width={330/26+.2} height="12.7" fill={`rgba(0,207,232,${alpha})`} />)
    }
  }

  return (
    <section className="model-experiment" id="classifier" aria-labelledby="experiment-title">
      <div className="container experiment-layout">
        <div className="experiment-copy">
          <span className="experiment-label"><span />A model you can actually train</span>
          <h2 id="experiment-title">Change an input.<br />Follow the result.</h2>
          <p>A tiny binary classifier, with its moving parts left visible. Choose a dataset, adjust the step size, and train it.</p>
          <div className="experiment-datasets" role="group" aria-label="Choose a dataset"><button aria-pressed={preset === 'linear'} onClick={() => choosePreset('linear')}>Linear separation</button><button aria-pressed={preset === 'xor'} onClick={() => choosePreset('xor')}>XOR challenge</button></div>
          <div className="experiment-rate"><label htmlFor={`${id}-rate`}>Learning rate<output htmlFor={`${id}-rate`}>{learningRate.toFixed(2)}</output></label><input id={`${id}-rate`} type="range" min="0.05" max="1.5" step="0.05" value={learningRate} onChange={(event) => setLearningRate(Number(event.target.value))} /></div>
          <div className="experiment-actions"><button onClick={() => setModel((previous) => train(previous,samples,learningRate))}>Train 25 steps<ArrowRight size={18} /></button><button className="experiment-reset" onClick={reset} aria-label="Reset the experiment"><RotateCcw size={17} /></button></div>
          <label className="experiment-boundary-toggle"><input type="checkbox" checked={showBoundary} onChange={(event) => setShowBoundary(event.target.checked)} />Show the decision boundary</label>
          <p className="experiment-dataset-note">{preset === 'xor' ? 'XOR needs a nonlinear boundary. A single linear classifier cannot separate these opposite-corner groups.' : 'One neuron, two features. The dashed line marks where the model assigns equal probability to both classes.'}</p>
          <details className="experiment-edit"><summary>Add your own sample</summary><form onSubmit={addSample}><div className="experiment-point-inputs"><label>Feature x₁<input type="number" min="-1" max="1" step="any" required value={point.x} onChange={(event) => setPoint((previous) => ({ ...previous,x:event.target.value }))} /></label><label>Feature x₂<input type="number" min="-1" max="1" step="any" required value={point.y} onChange={(event) => setPoint((previous) => ({ ...previous,y:event.target.value }))} /></label><label>Class<select value={point.label} onChange={(event) => setPoint((previous) => ({ ...previous,label:event.target.value }))}><option value="0">A</option><option value="1">B</option></select></label></div><button type="submit" disabled={samples.length>=48}><Plus size={15} />Add sample</button><span>Features range from −1 to 1. Up to 48 samples.</span></form><p role="status">{sampleMessage}</p></details>
        </div>
        <div className="experiment-console">
          <div className="experiment-console-top"><span>Logistic regression</span><span>Toy dataset / {samples.length} samples</span></div>
          {webglAvailable && <div className="experiment-view-switch" role="group" aria-label="Choose classifier visualization"><button type="button" aria-pressed={view === '2d'} onClick={() => setView('2d')}><ChartNoAxesColumnIncreasing size={15} aria-hidden="true" />2D map</button><button type="button" aria-pressed={view === '3d'} onClick={() => setView('3d')}><Box size={15} aria-hidden="true" />3D surface</button></div>}
          <div className="experiment-visualization">
            {view === '3d' && webglAvailable && ProbabilitySurface3D
              ? <Suspense fallback={<div className="experiment-surface-fallback">Preparing the probability surfaceâ€¦</div>}><ProbabilitySurface3D samples={samples} model={model} probability={probability} onFallback={returnToMap} /></Suspense>
              : <svg className="experiment-plot" viewBox="0 0 400 320" role="img" aria-label={`Classifier probability map after ${model.step} training steps. Cross-entropy loss ${loss.toFixed(3)}.`}><defs><clipPath id={id}><rect x="35" y="35" width="330" height="250" /></clipPath></defs><g clipPath={`url(#${id})`}>{cells}<path d="M35 97.5H365M35 160H365M35 222.5H365M117.5 35V285M200 35V285M282.5 35V285" className="experiment-grid-lines" />{showBoundary && <path d={`M${px(-1)} ${py(lineY(-1))}L${px(1)} ${py(lineY(1))}`} className="experiment-boundary" />}{samples.map(([x,y,label],index) => <circle key={index} cx={px(x)} cy={py(y)} r="5.5" className={label ? 'sample-one' : 'sample-zero'} />)}</g><path d="M35 35V285H365" className="experiment-axes" /><text x="200" y="309">Feature x₁</text><text transform="translate(15,175) rotate(-90)">Feature x₂</text></svg>}
          </div>
          <div className="experiment-readout" aria-live="polite"><span>Training step<strong>{String(model.step).padStart(3,'0')}</strong></span><span>Cross-entropy loss<strong>{loss.toFixed(3)}</strong></span><span className="experiment-legend"><i />Class A <i />Class B</span></div>
          <div className="experiment-parameters"><span>w₁ <b>{model.weights[0].toFixed(2)}</b></span><span>w₂ <b>{model.weights[1].toFixed(2)}</b></span><span>bias <b>{model.bias.toFixed(2)}</b></span></div>
          <p className="experiment-disclosure">A real logistic-regression toy running in your browser. No external model calls.</p>
        </div>
      </div>
    </section>
  )
}
