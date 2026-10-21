import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { TURN, TURN_CSS } from './anatomy/kit/turn.mjs'
import ROUTER_SCENE from './anatomy/neural-router/scene.generated.json'

const { data: ROUTER_DATA, svg: ROUTER_SVG } = ROUTER_SCENE

const FACE_Z = 8
const SPEED = 5.5

export default function NeuralRouter({ selected = 0 }) {
  const stageRef = useRef(null)
  const controllerRef = useRef(null)
  const readoutRef = useRef(null)
  const angleRef = useRef(0)
  const dragRef = useRef(null)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(preference.matches)
    sync()
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px 0px' })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const controller = TURN.mount(stage, ROUTER_DATA, {
      onFrame: (frame) => {
        const angle = ((Math.round(frame.values.router ?? 0) % 360) + 360) % 360
        if (readoutRef.current) readoutRef.current.textContent = `${String(angle).padStart(3, '0')}°`
      },
    })
    controllerRef.current = controller
    controller.set({ router: 0 })

    const pointerAngle = (event) => controller.angleAt(event.clientX, event.clientY, FACE_Z, 'router')
    const onPointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return
      if (!(event.target instanceof Element) || !event.target.closest('svg[data-live]')) return
      event.preventDefault()
      setPaused(true)
      dragRef.current = { pointer: pointerAngle(event), angle: angleRef.current }
      stage.setPointerCapture?.(event.pointerId)
    }
    const onPointerMove = (event) => {
      if (!dragRef.current) return
      const moved = pointerAngle(event) - dragRef.current.pointer
      angleRef.current = dragRef.current.angle + moved
      controller.set({ router: angleRef.current })
    }
    const onPointerUp = (event) => {
      if (!dragRef.current) return
      dragRef.current = null
      if (stage.hasPointerCapture?.(event.pointerId)) stage.releasePointerCapture(event.pointerId)
    }
    const onKeyDown = (event) => {
      const step = event.shiftKey ? 18 : 8
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        setPaused(true)
        angleRef.current += event.key === 'ArrowLeft' ? -step : step
        controller.set({ router: angleRef.current })
      } else if (event.key === 'Home') {
        event.preventDefault()
        angleRef.current = 0
        controller.set({ router: 0 })
      }
    }

    stage.addEventListener('pointerdown', onPointerDown)
    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerup', onPointerUp)
    stage.addEventListener('pointercancel', onPointerUp)
    stage.addEventListener('keydown', onKeyDown)
    return () => {
      stage.removeEventListener('pointerdown', onPointerDown)
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerup', onPointerUp)
      stage.removeEventListener('pointercancel', onPointerUp)
      stage.removeEventListener('keydown', onKeyDown)
      controller.destroy()
      controllerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (paused || reducedMotion || !visible) return undefined
    let frame = 0
    let last = 0
    const tick = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60
      last = now
      angleRef.current += dt * SPEED
      controllerRef.current?.set({ router: angleRef.current })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [paused, reducedMotion, visible])

  const reset = () => {
    angleRef.current = 0
    controllerRef.current?.set({ router: 0 })
  }

  return (
    <div className="nw-visual">
      <div
        ref={stageRef}
        className="nw-stage iso-turn"
        data-mode={selected}
        role="group"
        aria-label="Interactive 3D project pathway router"
        aria-describedby="nw-stage-note"
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: ROUTER_SVG }}
      />
      <div className="nw-stage-readout">
        <span><i className="nw-live-dot" />ROUTER LIVE <b>108 PARTS</b></span>
        <span>AZIMUTH <output aria-label="Current router angle" ref={readoutRef}>000°</output></span>
      </div>
      <p className="nw-stage-note" id="nw-stage-note">Drag to orbit · Select a pathway above · Arrow keys steer</p>
      <div className="nw-motion" role="group" aria-label="Router motion controls">
        <button type="button" onClick={reset} aria-label="Reset router angle" title="Reset angle">
          <RotateCcw size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={reducedMotion ? 'Automatic motion disabled by reduced motion preference' : paused ? 'Resume automatic rotation' : 'Pause automatic rotation'}
          aria-pressed={!paused && !reducedMotion}
          disabled={reducedMotion}
          title={reducedMotion ? 'Reduced motion is on' : paused ? 'Resume rotation' : 'Pause rotation'}
        >
          {paused || reducedMotion ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
        </button>
      </div>
      <style>{TURN_CSS}</style>
    </div>
  )
}
