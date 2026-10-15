import { useEffect, useRef } from 'react'
import './OrbitalInstrument.css'

/**
 * Decorative orbital gyroscope for the portrait plate.
 * The rings drift slowly via CSS; the whole instrument tilts toward the
 * pointer. Tilt is disabled for reduced-motion and for coarse (touch)
 * pointers, so the instrument stays static and calm where motion is unwelcome.
 */
export default function OrbitalInstrument() {
  const hostRef = useRef(null)
  const instrumentRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const instrument = instrumentRef.current
    if (!host || !instrument) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    let frame = 0
    let tiltX = 0
    let tiltY = 0

    const apply = () => {
      frame = 0
      instrument.style.setProperty('--oi-tilt-x', `${tiltX}deg`)
      instrument.style.setProperty('--oi-tilt-y', `${tiltY}deg`)
    }

    const queue = () => {
      if (!frame) frame = window.requestAnimationFrame(apply)
    }

    const onPointerMove = (event) => {
      const rect = host.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const offsetX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const offsetY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      tiltX = Math.round(Math.max(-1, Math.min(1, offsetX)) * 8)
      tiltY = Math.round(Math.max(-1, Math.min(1, offsetY)) * -8)
      queue()
    }

    const reset = () => {
      tiltX = 0
      tiltY = 0
      queue()
    }

    const enabled = () => !reduceMotion.matches && !coarsePointer.matches

    const sync = () => {
      if (enabled()) {
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        window.addEventListener('pointerleave', reset)
      } else {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerleave', reset)
        reset()
      }
    }

    sync()
    reduceMotion.addEventListener('change', sync)
    coarsePointer.addEventListener('change', sync)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', reset)
      reduceMotion.removeEventListener('change', sync)
      coarsePointer.removeEventListener('change', sync)
    }
  }, [])

  return (
    <span className="oi-host" aria-hidden="true" ref={hostRef}>
      <span className="oi-instrument" ref={instrumentRef}>
        <i /><i /><i /><b />
      </span>
    </span>
  )
}
