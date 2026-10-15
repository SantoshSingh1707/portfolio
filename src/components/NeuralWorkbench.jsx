import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import { portfolio } from '../data/mockData'
import './NeuralWorkbench.css'

const MODES = [
  { label: 'Documents', tone: 'study', input: 'Source material', process: 'Retrieve & generate', output: 'Active revision', short: 'Study' },
  { label: 'Code', tone: 'review', input: 'Python source', process: 'Local inference', output: 'Structured review', short: 'Review' },
  { label: 'Data', tone: 'chart', input: 'Tabular data', process: 'Train & evaluate', output: 'Price prediction', short: 'Predict' },
  { label: 'Images', tone: 'vision', input: 'Visual evidence', process: 'Inspect model signals', output: 'Image analysis', short: 'Inspect' },
]

const LAYERS = [
  { x: -3.9, count: 4, rows: 4 },
  { x: -1.35, count: 8, rows: 4 },
  { x: 1.35, count: 6, rows: 3 },
  { x: 3.9, count: 4, rows: 4 },
]

const NODES = LAYERS.flatMap((layer, layerIndex) => Array.from({ length: layer.count }, (_, index) => ({
  id: `${layerIndex}-${index}`,
  layer: layerIndex,
  index,
  x: layer.x,
  y: 1.55 - (index % layer.rows) / (layer.rows - 1) * 3.1,
  z: layer.count > layer.rows ? (Math.floor(index / layer.rows) - 0.5) * 1.35 : 0,
})))

const EDGES = NODES.filter((node) => node.layer < 3).flatMap((from) => NODES.filter((node) => node.layer === from.layer + 1).map((to) => ({ from, to })))

function isActiveNode(node, selected) {
  if (node.layer === 0 || node.layer === 3) return node.index === selected
  if (node.layer === 1) return node.index === selected * 2 % 8 || node.index === (selected * 2 + 3) % 8
  return node.index === selected % 6 || node.index === (selected + 2) % 6
}

function curvePoint(a, b, t) {
  const u = 1 - t
  const reach = (b.x - a.x) * 0.42
  const eased = t * t * (3 - 2 * t)
  return { x: u ** 3 * a.x + 3 * u ** 2 * t * (a.x + reach) + 3 * u * t ** 2 * (b.x - reach) + t ** 3 * b.x, y: a.y + (b.y - a.y) * eased }
}

function traceCurve(context, a, b) {
  const reach = (b.x - a.x) * 0.42
  context.moveTo(a.x, a.y)
  context.bezierCurveTo(a.x + reach, a.y, b.x - reach, b.y, b.x, b.y)
}

export default function NeuralWorkbench({ className = '' }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const stateRef = useRef({ selected: 0, motion: true })
  const redrawRef = useRef(null)
  const [selected, setSelected] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [motionOverride, setMotionOverride] = useState(null)
  const motionEnabled = motionOverride ?? !reducedMotion
  const mode = MODES[selected]
  const project = portfolio.projects.find((item) => item.tone === mode.tone)

  useEffect(() => {
    stateRef.current = { selected, motion: motionEnabled }
    redrawRef.current?.()
  }, [selected, motionEnabled])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event) => { setReducedMotion(event.matches); setMotionOverride(null) }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return undefined
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return undefined
    let width = 900
    let height = 460
    let frame = 0
    let lastFrame = 0
    let elapsed = 0
    let inView = true
    let disposed = false
    let hitTargets = []
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, hover: null }

    const projectPoint = (point) => {
      const ay = -0.16 + pointer.x * 0.12
      const ax = 0.19 + pointer.y * 0.1
      const x = point.x * Math.cos(ay) + point.z * Math.sin(ay)
      const z = -point.x * Math.sin(ay) + point.z * Math.cos(ay)
      const y = point.y * Math.cos(ax) - z * Math.sin(ax)
      const depth = point.y * Math.sin(ax) + z * Math.cos(ax)
      const perspective = 9.5 / (9.5 - depth)
      const scale = Math.min(width / 10.1, height / 5.6)
      return { x: width / 2 + x * scale * perspective, y: height * 0.52 - y * scale * perspective, z: depth, scale: perspective }
    }

    const draw = () => {
      if (disposed) return
      const selectedMode = stateRef.current.selected
      context.clearRect(0, 0, width, height)

      context.fillStyle = '#0C0E13'
      context.fillRect(0, 0, width, height)

      // The floor and translucent slices establish depth before the signal paths.
      context.strokeStyle = 'rgba(176, 172, 164, 0.18)'
      context.lineWidth = 0.8
      context.beginPath()
      for (let x = -5; x <= 5; x += 0.5) {
        const a = projectPoint({ x, y: -2.05, z: -2.4 })
        const b = projectPoint({ x, y: -2.05, z: 2.1 })
        context.moveTo(a.x, a.y); context.lineTo(b.x, b.y)
      }
      for (let z = -2.4; z <= 2.2; z += 0.5) {
        const a = projectPoint({ x: -5, y: -2.05, z })
        const b = projectPoint({ x: 5, y: -2.05, z })
        context.moveTo(a.x, a.y); context.lineTo(b.x, b.y)
      }
      context.stroke()

      LAYERS.forEach((layer, index) => {
        const corners = [
          { x: layer.x, y: 1.95, z: -1.1 }, { x: layer.x, y: 1.95, z: 1.1 },
          { x: layer.x, y: -1.95, z: 1.1 }, { x: layer.x, y: -1.95, z: -1.1 },
        ].map(projectPoint)
        context.beginPath()
        corners.forEach((point, cornerIndex) => cornerIndex ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y))
        context.closePath()
        context.fillStyle = 'rgba(176, 172, 164, 0.045)'
        context.fill()
        context.strokeStyle = index === 1 || index === 2 ? 'rgba(176, 172, 164, 0.38)' : 'rgba(176, 172, 164, 0.24)'
        context.lineWidth = 1
        context.stroke()
      })

      const projected = new Map(NODES.map((node) => [node.id, { ...projectPoint(node), node }]))
      const orderedEdges = EDGES.map((edge) => ({ ...edge, a: projected.get(edge.from.id), b: projected.get(edge.to.id), active: isActiveNode(edge.from, selectedMode) && isActiveNode(edge.to, selectedMode) }))
        .sort((a, b) => Number(a.active) - Number(b.active) || (a.a.z + a.b.z) - (b.a.z + b.b.z))

      orderedEdges.forEach((edge, index) => {
        const { a, b, active } = edge
        context.beginPath()
        traceCurve(context, a, b)
        context.lineWidth = active ? 1.3 : 0.65
        if (active) {
          const gradient = context.createLinearGradient(a.x, a.y, b.x, b.y)
          gradient.addColorStop(0, 'rgba(241, 122, 90, 0.9)')
          gradient.addColorStop(0.6, 'rgba(241, 122, 90, 0.8)')
          gradient.addColorStop(1, 'rgba(242, 238, 230, 0.9)')
          context.strokeStyle = gradient
          context.shadowColor = '#7886FF'
          context.shadowBlur = 4
        } else context.strokeStyle = 'rgba(176, 172, 164, 0.24)'
        context.stroke()
        context.shadowBlur = 0
        if (active) {
          const progress = (elapsed * 0.22 - edge.from.layer * 0.23 + index * 0.113 + 20) % 1
          const point = curvePoint(a, b, progress)
          context.strokeStyle = '#F17A5A'
          context.lineWidth = 1
          context.beginPath(); context.arc(point.x, point.y, 5, 0, Math.PI * 2); context.stroke()
          context.fillStyle = '#EEECE5'
          context.beginPath(); context.arc(point.x, point.y, 1.6, 0, Math.PI * 2); context.fill()
        }
      })

      hitTargets = []
      Array.from(projected.values()).sort((a, b) => a.z - b.z).forEach((point) => {
        const active = isActiveNode(point.node, selectedMode)
        const isEndpoint = point.node.layer === 0 || point.node.layer === 3
        const radius = (isEndpoint ? 6.8 : 5.2) * point.scale
        if (isEndpoint) hitTargets.push({ ...point, radius: Math.max(17, radius * 2) })
        if (active || pointer.hover === point.node.id) {
          context.strokeStyle = '#D1ED79'
          context.lineWidth = 1
          context.beginPath(); context.arc(point.x, point.y, radius * 1.9, 0, Math.PI * 2); context.stroke()
        }
        const body = context.createRadialGradient(point.x - radius * 0.35, point.y - radius * 0.4, 0, point.x, point.y, radius)
        body.addColorStop(0, active ? '#EEECE5' : '#A8ABB6')
        body.addColorStop(0.25, active ? '#D1ED79' : '#5E6473')
        body.addColorStop(0.65, active ? '#7886FF' : '#303545')
        body.addColorStop(1, active ? '#343C57' : '#151923')
        context.fillStyle = body
        context.beginPath(); context.arc(point.x, point.y, radius, 0, Math.PI * 2); context.fill()
        context.strokeStyle = active ? 'rgba(242, 238, 230, 0.9)' : 'rgba(176, 172, 164, 0.7)'
        context.lineWidth = 0.8; context.stroke()
        if (isEndpoint && width > 480) {
          const isInput = point.node.layer === 0
          context.font = `${active ? 500 : 400} 10px "Space Mono", monospace`
          context.textAlign = isInput ? 'right' : 'left'
          context.fillStyle = active ? '#EEECE5' : '#A8ABB6'
          context.fillText(isInput ? MODES[point.node.index].label : MODES[point.node.index].short,
            point.x + (isInput ? -17 : 17), point.y + 3.5)
        }
      })

      context.font = '500 9px "Space Mono", monospace'
      context.textAlign = 'center'
      context.fillStyle = '#A8ABB6'
      ;[{ x: -3.9, text: 'INPUTS' }, { x: 0, text: 'REPRESENTATION' }, { x: 3.9, text: 'OUTPUTS' }].forEach((label) => {
        const point = projectPoint({ x: label.x, y: 2.4, z: 0 })
        context.fillText(label.text, point.x, point.y)
      })
    }

    const tick = (now) => {
      frame = 0
      if (disposed || !inView || document.hidden || !stateRef.current.motion) return
      if (now - lastFrame >= 1000 / 30) {
        const delta = lastFrame ? Math.min((now - lastFrame) / 1000, 0.065) : 0
        elapsed += delta
        lastFrame = now
        pointer.x += (pointer.targetX - pointer.x) * 0.09
        pointer.y += (pointer.targetY - pointer.y) * 0.09
        draw()
      }
      frame = requestAnimationFrame(tick)
    }

    const update = () => {
      cancelAnimationFrame(frame)
      frame = 0
      lastFrame = 0
      draw()
      if (!disposed && inView && !document.hidden && stateRef.current.motion) frame = requestAnimationFrame(tick)
    }
    redrawRef.current = update
    const resize = () => {
      const bounds = stage.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(stage)
    const intersectionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    }, { rootMargin: '60px' }) : null
    intersectionObserver?.observe(stage)

    const pointerPosition = (event) => {
      const bounds = canvas.getBoundingClientRect()
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    }
    const findTarget = (position) => hitTargets.find((target) => Math.hypot(target.x - position.x, target.y - position.y) <= target.radius)
    const onMove = (event) => {
      const position = pointerPosition(event)
      pointer.hover = findTarget(position)?.node.id ?? null
      canvas.style.cursor = pointer.hover ? 'pointer' : 'default'
      if (event.pointerType !== 'touch' && stateRef.current.motion) {
        pointer.targetX = position.x / width * 2 - 1
        pointer.targetY = position.y / height * 2 - 1
      }
      if (!stateRef.current.motion) draw()
    }
    const onLeave = () => { pointer.targetX = 0; pointer.targetY = 0; pointer.hover = null; if (!stateRef.current.motion) draw() }
    const onSelect = (event) => {
      const target = findTarget(pointerPosition(event))
      if (target) setSelected(target.node.index)
    }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('pointerdown', onSelect)
    document.addEventListener('visibilitychange', update)
    resize()
    update()

    return () => {
      disposed = true
      redrawRef.current = null
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver?.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointerdown', onSelect)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return (
    <section className={`nw-workbench ${className}`} aria-label="Interactive project pathways">
      <div className="nw-toolbar">
        <div className="nw-intro"><span className="nw-signal" aria-hidden="true" /><span>Explore the project pathways</span></div>
        <div className="nw-modes" role="group" aria-label="Choose a project pathway">
          {MODES.map((item, index) => <button key={item.tone} type="button" aria-pressed={selected === index}
            className={`nw-mode${selected === index ? ' nw-mode--active' : ''}`} onClick={() => setSelected(index)}>
            <span className="nw-mode-number" aria-hidden="true">0{index + 1}</span>{item.label}
          </button>)}
        </div>
      </div>
      <div className="nw-layout">
        <div className="nw-stage" ref={stageRef}>
          <canvas className="nw-canvas" ref={canvasRef} aria-hidden="true" />
          <span className="nw-stage-note">A project map, inspired by neural networks.</span>
          <button className="nw-motion" type="button" aria-pressed={!motionEnabled}
            aria-label={motionEnabled ? 'Pause network motion' : 'Resume network motion'} onClick={() => setMotionOverride(!motionEnabled)}>
            {motionEnabled ? <Pause size={11} aria-hidden="true" /> : <Play size={11} aria-hidden="true" />}
            {motionEnabled ? 'Pause motion' : 'Resume motion'}
          </button>
        </div>
        <aside className="nw-inspector" aria-live="polite" aria-atomic="true">
          <div className="nw-inspector-top"><span>Selected pathway</span><span className="nw-path-index">0{selected + 1} / 04</span></div>
          <div className="nw-project-category">{project?.category}</div>
          <h2 className="nw-project-title">{project?.title}</h2>
          <p className="nw-project-summary">{project?.summary}</p>
          <ol className="nw-pathway">
            <li><span className="nw-pathway-key">Input</span><span>{mode.input}</span></li>
            <li><span className="nw-pathway-key">Process</span><span>{mode.process}</span></li>
            <li><span className="nw-pathway-key">Output</span><span>{mode.output}</span></li>
          </ol>
          <a className="nw-project-link" href={`/projects/${project?.slug}`}>Explore project<ArrowUpRight size={17} aria-hidden="true" /></a>
        </aside>
      </div>
    </section>
  )
}
