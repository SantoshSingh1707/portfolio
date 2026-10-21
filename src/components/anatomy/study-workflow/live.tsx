'use client'

import * as React from 'react'
import { BookOpen, FileText, Layers3 } from 'lucide-react'
import { translateAlong } from '../kit/iso-kit'
import { IsoFigure } from '../kit/react/draw'
import { follow, useInView, useLoop, useReadout, useStillness } from '../kit/react/live'
import { phaseText, STAGES, STAGE_X } from './model'
import { HEIGHT, P, WIDTH } from './view'

const ICONS = [FileText, Layers3, BookOpen]

type LiveProps = {
  base: React.ReactNode
  feeder: React.ReactNode
  index: React.ReactNode
  model: React.ReactNode
  frame: React.ReactNode
  carriage: React.ReactNode
}

export function StudyWorkflowLive(props: LiveProps) {
  const { anchor, say } = useReadout<HTMLDivElement>()
  const visible = useInView(anchor)
  const still = useStillness()
  const carriage = React.useRef<SVGGElement>(null)
  const motion = React.useRef<{ x: number; target: number; stage: number }>({ x: STAGE_X[0], target: STAGE_X[0], stage: 0 })
  const [active, setActive] = React.useState(0)
  const [moving, setMoving] = React.useState(false)
  const [tourPaused, setTourPaused] = React.useState(false)
  const resumeTimer = React.useRef<number | null>(null)

  const tick = React.useCallback((dt: number, calm: boolean) => {
    const state = motion.current
    state.x = follow(state.x, state.target, dt, 0.48, calm)
    carriage.current?.setAttribute('transform', translateAlong(P, [state.x, 0, 0]))
    const isMoving = state.x !== state.target
    say(phaseText(state.stage, isMoving))
    if (!isMoving) setMoving(false)
    return isMoving
  }, [say])
  const kick = useLoop(tick, visible && moving)

  const pauseForInput = React.useCallback(() => {
    setTourPaused(true)
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current)
  }, [])

  const resumeAfterInput = React.useCallback(() => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      setTourPaused(false)
      resumeTimer.current = null
    }, 3600)
  }, [])

  const choose = React.useCallback((index: number, fromTour = false) => {
    const next = (index + STAGES.length) % STAGES.length
    if (!fromTour) pauseForInput()
    motion.current.stage = next
    motion.current.target = STAGE_X[next] ?? STAGE_X[0]
    setActive(next)
    setMoving(true)
    kick()
  }, [kick, pauseForInput])

  React.useEffect(() => {
    if (!visible || tourPaused || still) return
    const delay = active === 0 ? 1400 : 3600
    const timer = window.setTimeout(() => choose(active + 1, true), delay)
    return () => window.clearTimeout(timer)
  }, [active, choose, still, tourPaused, visible])

  React.useEffect(() => () => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current)
  }, [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      choose(active + 1)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      choose(active - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      choose(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      choose(STAGES.length - 1)
    }
  }

  return (
    <div
      ref={anchor}
      className="study-bench-live"
      role="group"
      tabIndex={0}
      aria-label="Local study workflow. Use the arrow keys to move the retrieval carriage between source files, retrieval, and study outputs."
      data-active-stage={active}
      onKeyDown={onKeyDown}
      onPointerEnter={pauseForInput}
      onPointerLeave={resumeAfterInput}
      onFocus={pauseForInput}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) resumeAfterInput()
      }}
    >
      <IsoFigure width={WIDTH} height={HEIGHT} label="A shaded isometric study bench showing file ingestion, source indexing, a moving retrieval carriage, a local model, and quiz and note outputs.">
        {props.base}
        {props.feeder}
        {props.index}
        {props.model}
        {props.frame}
        <g ref={carriage} transform={translateAlong(P, [STAGE_X[0], 0, 0])}>{props.carriage}</g>
      </IsoFigure>
      <div className="study-bench-controls" role="group" aria-label="Study workflow stages">
        {STAGES.map((stage, index) => {
          const Icon = ICONS[index] ?? FileText
          return (
            <button
              key={stage.label}
              type="button"
              aria-pressed={active === index}
              className={`study-bench-step${active === index ? ' is-active' : ''}`}
              onClick={() => choose(index)}
            >
              <span className="study-bench-step__index">0{index + 1}</span>
              <Icon size={15} aria-hidden="true" />
              <span>{stage.label}</span>
            </button>
          )
        })}
      </div>
      <span className="study-bench-sr-only" aria-live="polite" aria-atomic="true">{STAGES[active]?.text}</span>
    </div>
  )
}
