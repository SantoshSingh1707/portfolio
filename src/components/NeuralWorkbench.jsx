import { Link } from "@tanstack/react-router"
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

function curveControls(a, b, index) {
  const reach = (b.world.x - a.world.x) * 0.42
  const bend = Math.sin(index * 1.71) * 0.14
  const lift = Math.cos(index * 1.27) * 0.18
  return [
    a.world,
    { x: a.world.x + reach, y: a.world.y + bend, z: a.world.z + lift },
    { x: b.world.x - reach, y: b.world.y - bend, z: b.world.z + lift },
    b.world,
  ]
}

function cubicPoint(points, t) {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return {
    x: a * points[0].x + b * points[1].x + c * points[2].x + d * points[3].x,
    y: a * points[0].y + b * points[1].y + c * points[2].y + d * points[3].y,
    z: a * points[0].z + b * points[1].z + c * points[2].z + d * points[3].z,
  }
}

function traceCurve(context, controls, projectPoint, steps = 14) {
  const start = projectPoint(controls[0])
  context.moveTo(start.x, start.y)
  for (let step = 1; step <= steps; step++) {
    const point = projectPoint(cubicPoint(controls, step / steps))
    context.lineTo(point.x, point.y)
  }
}

export default function NeuralWorkbench({ className = '' }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const stateRef = useRef({ selected: 0 })
  const redrawRef = useRef(null)
  const syncAnimationRef = useRef(null)
  const motionPlayingRef = useRef(true)
  const [selected, setSelected] = useState(0)
  const [motionPlaying, setMotionPlaying] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const mode = MODES[selected]
  const project = portfolio.projects.find((item) => item.tone === mode.tone)

  const toggleMotion = () => {
    const next = !motionPlayingRef.current
    motionPlayingRef.current = next
    setMotionPlaying(next)
    syncAnimationRef.current?.()
  }

  useEffect(() => {
    stateRef.current = { selected }
    redrawRef.current?.()
  }, [selected])

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return undefined
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return undefined
    let width = 900
    let height = 460
    let disposed = false
    let visible = false
    let frameId = 0
    let lastFrame = 0
    let animationTime = 0
    let hitTargets = []
    const pointer = { hover: null, drag: null }
    const rotation = { x: 0.19, y: -0.16 }
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')

    const projectPoint = (point) => {
      const x = point.x * Math.cos(rotation.y) + point.z * Math.sin(rotation.y)
      const z = -point.x * Math.sin(rotation.y) + point.z * Math.cos(rotation.y)
      const y = point.y * Math.cos(rotation.x) - z * Math.sin(rotation.x)
      const depth = point.y * Math.sin(rotation.x) + z * Math.cos(rotation.x)
      const perspective = 9.5 / (9.5 - depth)
      const scale = Math.min(width / 10.1, height / 5.6)
      return { x: width / 2 + x * scale * perspective, y: height * 0.52 - y * scale * perspective, z: depth, scale: perspective }
    }

    const draw = () => {
      if (disposed) return
      const selectedMode = stateRef.current.selected
      context.clearRect(0, 0, width, height)

      context.fillStyle = '#101A35'
      context.fillRect(0, 0, width, height)

      // The floor and translucent slices establish depth before the signal paths.
      context.strokeStyle = 'rgba(168, 183, 208, 0.22)'
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
        context.fillStyle = 'rgba(168, 183, 208, 0.055)'
        context.fill()
        context.strokeStyle = index === 1 || index === 2 ? 'rgba(168, 183, 208, 0.42)' : 'rgba(168, 183, 208, 0.28)'
        context.lineWidth = 1
        context.stroke()
      })

      const time = animationTime
      const projected = new Map(NODES.map((node) => {
        const phase = (node.layer + 1) * 1.31 + node.index * 1.73
        const active = isActiveNode(node, selectedMode)
        const world = {
          x: node.x + Math.sin(time * 0.72 + phase) * 0.05,
          y: node.y + Math.sin(time * 0.92 + phase * 1.1) * 0.11,
          z: node.z + Math.sin(time * 0.64 + phase * 1.3) * 0.27 + (active ? Math.sin(time * 1.8 + phase) * 0.07 : 0),
        }
        const activation = active ? 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(time * 3.2 - node.layer * 0.9 - node.index * 0.3)) : 0.12
        return [node.id, { ...projectPoint(world), node, world, active, activation }]
      }))
      const orderedEdges = EDGES.map((edge, index) => ({
        ...edge,
        index,
        a: projected.get(edge.from.id),
        b: projected.get(edge.to.id),
        active: projected.get(edge.from.id).active && projected.get(edge.to.id).active,
      }))
        .sort((a, b) => Number(a.active) - Number(b.active) || (a.a.z + a.b.z) - (b.a.z + b.b.z))

      orderedEdges.forEach((edge) => {
        const { a, b, active } = edge
        const controls = curveControls(a, b, edge.index)
        context.beginPath()
        traceCurve(context, controls, projectPoint)
        context.lineWidth = active ? 1.3 : 0.65
        if (active) {
          const gradient = context.createLinearGradient(a.x, a.y, b.x, b.y)
          gradient.addColorStop(0, 'rgba(100, 77, 235, 0.95)')
          gradient.addColorStop(0.6, 'rgba(0, 207, 232, 0.9)')
          gradient.addColorStop(1, 'rgba(243, 246, 255, 0.95)')
          context.strokeStyle = gradient
          context.shadowColor = '#B69CFF'
          context.shadowBlur = 4
        } else context.strokeStyle = 'rgba(168, 183, 208, 0.28)'
        context.stroke()
        context.shadowBlur = 0

        if (active) {
          const period = 2.4
          const duration = 1.3
          const offset = edge.from.layer * 0.34 + (edge.index % 5) * 0.11
          const age = ((time - offset) % period + period) % period
          if (age < duration) {
            const progress = age / duration
            const pulse = projectPoint(cubicPoint(controls, progress))
            const pulseRadius = 1.25 + Math.sin(progress * Math.PI) * 1.2
            context.save()
            context.globalCompositeOperation = 'lighter'
            context.shadowColor = '#54F1E5'
            context.shadowBlur = 10
            context.fillStyle = '#EAF3FF'
            context.beginPath(); context.arc(pulse.x, pulse.y, pulseRadius * pulse.scale, 0, Math.PI * 2); context.fill()
            context.restore()
          }
        }
      })

      hitTargets = []
      Array.from(projected.values()).sort((a, b) => a.z - b.z).forEach((point) => {
        const active = point.active
        const isEndpoint = point.node.layer === 0 || point.node.layer === 3
        const radius = (isEndpoint ? 6.8 : 5.2) * point.scale * (active ? 1 + point.activation * 0.07 : 1)
        if (isEndpoint) hitTargets.push({ ...point, radius: Math.max(17, radius * 2) })
        if (active || pointer.hover === point.node.id) {
          context.save()
          context.globalAlpha = active ? 0.18 + point.activation * 0.12 : 0.14
          context.fillStyle = '#54F1E5'
          context.beginPath(); context.arc(point.x, point.y, radius * (active ? 2.8 : 1.9), 0, Math.PI * 2); context.fill()
          context.globalAlpha = active ? 0.55 + point.activation * 0.35 : 1
          context.strokeStyle = '#54F1E5'
          context.lineWidth = 1
          context.beginPath(); context.arc(point.x, point.y, radius * (active ? 1.8 + point.activation * 0.16 : 1.9), 0, Math.PI * 2); context.stroke()
          context.restore()
        }
        const body = context.createRadialGradient(point.x - radius * 0.35, point.y - radius * 0.4, 0, point.x, point.y, radius)
        body.addColorStop(0, active ? '#EAF3FF' : '#A6B6CC')
        body.addColorStop(0.25, active ? '#54F1E5' : '#50617B')
        body.addColorStop(0.65, active ? '#B69CFF' : '#50617B')
        body.addColorStop(1, active ? '#121C2D' : '#121C2D')
        context.fillStyle = body
        context.beginPath(); context.arc(point.x, point.y, radius, 0, Math.PI * 2); context.fill()
        context.strokeStyle = active ? 'rgba(243, 246, 255, 0.95)' : 'rgba(168, 183, 208, 0.78)'
        context.lineWidth = 0.8; context.stroke()
        if (isEndpoint && width > 480) {
          const isInput = point.node.layer === 0
          context.font = `${active ? 500 : 400} 10px "Space Mono", monospace`
          context.textAlign = isInput ? 'right' : 'left'
          context.fillStyle = active ? '#EAF3FF' : '#A6B6CC'
          context.fillText(isInput ? MODES[point.node.index].label : MODES[point.node.index].short,
            point.x + (isInput ? -17 : 17), point.y + 3.5)
        }
      })

      context.font = '500 9px "Space Mono", monospace'
      context.textAlign = 'center'
      context.fillStyle = '#A6B6CC'
      ;[{ x: -3.9, text: 'INPUTS' }, { x: 0, text: 'REPRESENTATION' }, { x: 3.9, text: 'OUTPUTS' }].forEach((label) => {
        const point = projectPoint({ x: label.x, y: 2.4, z: 0 })
        context.fillText(label.text, point.x, point.y)
      })
    }

    const canAnimate = () => !disposed && !motionPreference.matches && motionPlayingRef.current && visible && !document.hidden
    const animate = (now) => {
      if (!canAnimate()) {
        frameId = 0
        lastFrame = 0
        return
      }
      const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 1 / 30) : 1 / 60
      lastFrame = now
      animationTime += dt
      draw()
      frameId = requestAnimationFrame(animate)
    }
    const syncAnimation = () => {
      if (canAnimate()) {
        if (!frameId) {
          lastFrame = 0
          frameId = requestAnimationFrame(animate)
        }
      } else if (frameId) {
        cancelAnimationFrame(frameId)
        frameId = 0
        lastFrame = 0
        draw()
      }
    }
    const onMotionPreference = () => {
      setReducedMotion(motionPreference.matches)
      syncAnimation()
    }
    const onVisibilityChange = () => syncAnimation()
    motionPreference.addEventListener('change', onMotionPreference)
    document.addEventListener('visibilitychange', onVisibilityChange)
    setReducedMotion(motionPreference.matches)
    syncAnimationRef.current = syncAnimation
    let visibilityObserver
    if (typeof IntersectionObserver === 'undefined') visible = true
    else {
      visibilityObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        syncAnimation()
      }, { rootMargin: '100px 0px' })
      visibilityObserver.observe(stage)
    }
    const update = () => draw()
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
    const pointerPosition = (event) => {
      const bounds = canvas.getBoundingClientRect()
      return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    }
    const findTarget = (position) => hitTargets.find((target) => Math.hypot(target.x - position.x, target.y - position.y) <= target.radius)
    const onMove = (event) => {
      const position = pointerPosition(event)
      if (pointer.drag) {
        const dx = event.clientX - pointer.drag.x
        const dy = event.clientY - pointer.drag.y
        if (Math.abs(dx) + Math.abs(dy) > 2) pointer.drag.moved = true
        rotation.y = Math.max(-0.9, Math.min(0.9, pointer.drag.rotationY + dx * 0.006))
        rotation.x = Math.max(-0.8, Math.min(0.8, pointer.drag.rotationX - dy * 0.006))
        draw()
        return
      }
      pointer.hover = findTarget(position)?.node.id ?? null
      canvas.style.cursor = pointer.hover ? 'pointer' : 'grab'
      draw()
    }
    const onDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return
      pointer.drag = { x: event.clientX, y: event.clientY, rotationX: rotation.x, rotationY: rotation.y, moved: false }
      canvas.setPointerCapture?.(event.pointerId)
    }
    const onUp = (event) => {
      if (!pointer.drag) return
      const wasDragged = pointer.drag.moved
      pointer.drag = null
      if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
      if (!wasDragged) {
        const target = findTarget(pointerPosition(event))
        if (target) setSelected(target.node.index)
      }
      draw()
    }
    const onLeave = () => { if (!pointer.drag) { pointer.hover = null; draw() } }
    const onKeyDown = (event) => {
      const step = event.shiftKey ? 0.16 : 0.08
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        rotation.y = Math.max(-0.9, Math.min(0.9, rotation.y + (event.key === 'ArrowLeft' ? -step : step)))
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        rotation.x = Math.max(-0.8, Math.min(0.8, rotation.x + (event.key === 'ArrowUp' ? -step : step)))
      } else return
      draw()
    }
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerleave', onLeave)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('keydown', onKeyDown)
    resize()
    update()

    return () => {
      disposed = true
      redrawRef.current = null
      syncAnimationRef.current = null
      if (frameId) cancelAnimationFrame(frameId)
      visibilityObserver?.disconnect()
      motionPreference.removeEventListener('change', onMotionPreference)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      resizeObserver.disconnect()
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('keydown', onKeyDown)
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
          <canvas className="nw-canvas" ref={canvasRef} role="img" aria-label="Interactive 3D neural network with 22 moving neurons and 104 synapses. Signal pulses travel along the selected pathway. Drag to rotate or use the arrow keys." aria-describedby="nw-stage-note" tabIndex={0} />
          <span className="nw-motion-status" aria-hidden="true"><i />3D SIGNAL FLOW <b>22 NEURONS / 104 SYNAPSES</b></span>
          <button
            className="nw-motion-toggle"
            type="button"
            onClick={toggleMotion}
            disabled={reducedMotion}
            aria-pressed={motionPlaying && !reducedMotion}
            aria-label={reducedMotion ? 'Neuron motion disabled by reduced motion preference' : motionPlaying ? 'Pause neuron motion' : 'Resume neuron motion'}
            title={reducedMotion ? 'Reduced motion is on' : motionPlaying ? 'Pause neuron motion' : 'Resume neuron motion'}
          >
            {motionPlaying && !reducedMotion ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          </button>
          <span className="nw-stage-note" id="nw-stage-note">Drag to rotate · Select a node · Arrow keys also work</span>
        </div>
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
