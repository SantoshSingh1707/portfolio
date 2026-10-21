import { useId, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import './Interactive3DFrame.css'

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

export default function Interactive3DFrame({ children, label, hint = 'Drag to rotate. Use the arrow keys, or reset the view.', className = '' }) {
  const hintId = useId()
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const drag = useRef(null)

  const onPointerDown = (event) => {
    if (event.button !== 0 || event.target.closest('button, a, input, select, textarea')) return
    drag.current = { x: event.clientX, y: event.clientY, rotation, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!drag.current) return
    const dx = event.clientX - drag.current.x
    const dy = event.clientY - drag.current.y
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true
    setRotation({
      x: clamp(drag.current.rotation.x - dy * 0.22, -20, 20),
      y: clamp(drag.current.rotation.y + dx * 0.22, -28, 28),
    })
  }

  const onPointerUp = (event) => {
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const onKeyDown = (event) => {
    if (event.target !== event.currentTarget) return
    const amount = event.shiftKey ? 12 : 6
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      setRotation((current) => ({ ...current, y: clamp(current.y + (event.key === 'ArrowLeft' ? -amount : amount), -28, 28) }))
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      setRotation((current) => ({ ...current, x: clamp(current.x + (event.key === 'ArrowUp' ? -amount : amount), -20, 20) }))
    }
  }

  return (
    <div
      className={`interactive-3d-frame ${className}`.trim()}
      role="group"
      aria-label={label}
      aria-roledescription="interactive 3D view"
      aria-describedby={hintId}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <div className="interactive-3d-frame__scene" style={{ '--frame-rotate-x': `${rotation.x}deg`, '--frame-rotate-y': `${rotation.y}deg` }}>
        {children}
      </div>
      <button className="interactive-3d-frame__reset" type="button" onClick={() => setRotation({ x: 0, y: 0 })} aria-label="Reset 3D view" title="Reset view">
        <RotateCcw size={15} aria-hidden="true" />
      </button>
      <span className="interactive-3d-frame__hint" id={hintId}>{hint}</span>
    </div>
  )
}
