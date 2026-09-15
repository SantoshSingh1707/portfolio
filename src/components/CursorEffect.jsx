import { useEffect, useRef } from 'react'

function CursorEffect() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let ringX = targetX
    let ringY = targetY
    let frameId
    let magneticTarget = null

    const move = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      document.body.classList.add('has-cursor')
    }

    const animate = () => {
      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const dx = centerX - targetX
        const dy = centerY - targetY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const pull = Math.min(dist * 0.35, 24)
        const pullX = dist > 0 ? (dx / dist) * pull : 0
        const pullY = dist > 0 ? (dy / dist) * pull : 0
        ringX += (targetX + pullX - ringX) * 0.12
        ringY += (targetY + pullY - ringY) * 0.12
      } else {
        ringX += (targetX - ringX) * 0.14
        ringY += (targetY - ringY) * 0.14
      }
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      frameId = requestAnimationFrame(animate)
    }

    const overInteractive = (event) => {
      const target = event.target.closest('a, button, .text-link, .project-filter')
      if (target) {
        document.body.classList.add('cursor-focus')
        magneticTarget = target
      }
    }
    const leaveInteractive = (event) => {
      const target = event.target.closest('a, button, .text-link, .project-filter')
      if (target) {
        document.body.classList.remove('cursor-focus')
        magneticTarget = null
      }
    }

    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', overInteractive)
    document.addEventListener('pointerout', leaveInteractive)
    animate()
    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', overInteractive)
      document.removeEventListener('pointerout', leaveInteractive)
      document.body.classList.remove('has-cursor', 'cursor-focus')
    }
  }, [])

  return <><span className="cursor-ring" ref={ringRef} aria-hidden="true" /><span className="cursor-dot" ref={dotRef} aria-hidden="true" /></>
}

export default CursorEffect
