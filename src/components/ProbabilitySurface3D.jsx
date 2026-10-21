import { useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'

const VERTEX_SHADER = `
attribute vec4 aPoint;
uniform float uPointMode;
uniform float uLineMode;
uniform vec2 uRotation;
uniform vec2 uSelectedPoint;
uniform float uSelectedMode;
uniform float uBoundaryMode;
varying float vProbability;
varying float vLabel;
varying float vPointMode;
varying float vLineMode;
varying float vSelected;
varying float vBoundaryMode;
void main() {
  float x = aPoint.x;
  float z = aPoint.y;
  float probability = aPoint.z;
  float height = (probability - 0.5) * 1.35;
  float cy = cos(uRotation.y);
  float sy = sin(uRotation.y);
  float cx = cos(uRotation.x);
  float sx = sin(uRotation.x);
  float rotatedX = x * cy + z * sy;
  float rotatedZ = -x * sy + z * cy;
  float rotatedY = height * cx - rotatedZ * sx;
  float depth = height * sx + rotatedZ * cx;
  float perspective = 1.0 / (1.0 + depth * 0.16);
  float screenX = (rotatedX - rotatedZ) * 0.48;
  float screenY = (rotatedX + rotatedZ) * 0.24 - rotatedY * 0.72;
  gl_Position = vec4(screenX * perspective, screenY * perspective, depth * 0.12, 1.0);
  vSelected = uPointMode > 0.5 && uSelectedMode > 0.5 && abs(x - uSelectedPoint.x) < 0.001 && abs(z - uSelectedPoint.y) < 0.001 ? 1.0 : 0.0;
  gl_PointSize = vSelected > 0.5 ? 14.0 : 8.0;
  vProbability = probability;
  vLabel = aPoint.w;
  vPointMode = uPointMode;
  vLineMode = uLineMode;
  vBoundaryMode = uBoundaryMode;
}`

const FRAGMENT_SHADER = `
precision mediump float;
varying float vProbability;
varying float vLabel;
varying float vPointMode;
varying float vLineMode;
varying float vSelected;
varying float vBoundaryMode;
void main() {
  if (vPointMode > 0.5) {
    vec2 point = gl_PointCoord - vec2(0.5);
    float radius = length(point);
    if (radius > 0.5) discard;
    if (vSelected > 0.5) {
      gl_FragColor = radius > 0.3 ? vec4(0.71, 0.61, 1.0, 1.0) : vec4(0.92, 0.97, 1.0, 1.0);
      return;
    }
    vec3 sampleColor = vLabel > 0.5 ? vec3(0.33, 0.95, 0.90) : vec3(0.71, 0.61, 1.0);
    gl_FragColor = vec4(sampleColor, 1.0);
  } else if (vLineMode > 0.5) {
    gl_FragColor = vBoundaryMode > 0.5 ? vec4(0.33, 0.95, 0.90, 0.95) : vec4(0.65, 0.72, 0.82, 0.24);
  } else {
    vec3 classA = vec3(0.71, 0.61, 1.0);
    vec3 classB = vec3(0.33, 0.95, 0.90);
    vec3 color = mix(classA, classB, vProbability);
    float heightLight = 0.78 + (vProbability * 0.22);
    gl_FragColor = vec4(color * heightLight, 1.0);
  }
}`

function createShader(gl, type, source) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Could not create a WebGL shader.')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || 'Could not compile a WebGL shader.'
    gl.deleteShader(shader)
    throw new Error(message)
  }
  return shader
}

function makeSurface(resolution, model, probability) {
  const side = resolution + 1
  const points = new Float32Array(side * side * 4)
  const triangles = new Uint16Array(resolution * resolution * 6)
  const lines = new Uint16Array(resolution * side * 4)
  let triangleIndex = 0
  let lineIndex = 0

  for (let row = 0; row <= resolution; row += 1) {
    const y = 1 - (row / resolution) * 2
    for (let column = 0; column <= resolution; column += 1) {
      const x = -1 + (column / resolution) * 2
      const offset = (row * side + column) * 4
      points[offset] = x
      points[offset + 1] = y
      points[offset + 2] = probability(model, x, y)
      points[offset + 3] = 0

      const vertex = row * side + column
      if (column < resolution) {
        lines[lineIndex++] = vertex
        lines[lineIndex++] = vertex + 1
      }
      if (row < resolution) {
        lines[lineIndex++] = vertex
        lines[lineIndex++] = vertex + side
      }
      if (row < resolution && column < resolution) {
        const nextRow = vertex + side
        triangles[triangleIndex++] = vertex
        triangles[triangleIndex++] = nextRow
        triangles[triangleIndex++] = vertex + 1
        triangles[triangleIndex++] = vertex + 1
        triangles[triangleIndex++] = nextRow
        triangles[triangleIndex++] = nextRow + 1
      }
    }
  }
  return { points, triangles, lines }
}

function makeSamplePoints(samples, model, probability) {
  const points = new Float32Array(samples.length * 4)
  samples.forEach(([x, y, label], index) => {
    const offset = index * 4
    points[offset] = x
    points[offset + 1] = y
    points[offset + 2] = probability(model, x, y)
    points[offset + 3] = label
  })
  return points
}

function makeBoundary(model) {
  const [weightX, weightY] = model.weights
  const candidates = []
  const add = (x, y) => {
    if (x < -1.001 || x > 1.001 || y < -1.001 || y > 1.001) return
    if (!candidates.some((point) => Math.hypot(point.x - x, point.y - y) < 0.001)) candidates.push({ x, y })
  }
  if (Math.abs(weightY) > 1e-8) {
    add(-1, -(model.bias - weightX) / weightY)
    add(1, -(model.bias + weightX) / weightY)
  }
  if (Math.abs(weightX) > 1e-8) {
    add(-(model.bias - weightY) / weightX, -1)
    add(-(model.bias + weightY) / weightX, 1)
  }
  if (candidates.length < 2) return { points: new Float32Array(0), count: 0 }
  const [first, second] = candidates
  return { points: new Float32Array([first.x, first.y, 0.5, 0, second.x, second.y, 0.5, 0]), count: 2 }
}

function projectSample(sample, rotation, width, height, probabilityValue) {
  const [x, z] = sample
  const surfaceHeight = (probabilityValue - 0.5) * 1.35
  const cy = Math.cos(rotation.y)
  const sy = Math.sin(rotation.y)
  const cx = Math.cos(rotation.x)
  const sx = Math.sin(rotation.x)
  const rotatedX = x * cy + z * sy
  const rotatedZ = -x * sy + z * cy
  const rotatedY = surfaceHeight * cx - rotatedZ * sx
  const depth = surfaceHeight * sx + rotatedZ * cx
  const perspective = 1 / (1 + depth * 0.16)
  const screenX = (rotatedX - rotatedZ) * 0.48 * perspective
  const screenY = ((rotatedX + rotatedZ) * 0.24 - rotatedY * 0.72) * perspective
  return { x: (screenX + 1) * width / 2, y: (1 - screenY) * height / 2 }
}

export default function ProbabilitySurface3D({ samples, model, probability, onFallback }) {
  const canvasRef = useRef(null)
  const redrawRef = useRef(null)
  const rotationRef = useRef({ x: 0.62, y: -0.22 })
  const selectedRef = useRef(0)
  const hoverRef = useRef(null)
  const dragRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hoverIndex, setHoverIndex] = useState(null)

  useEffect(() => {
    selectedRef.current = Math.min(selectedIndex, Math.max(0, samples.length - 1))
    redrawRef.current?.()
  }, [selectedIndex, samples.length])

  useEffect(() => {
    hoverRef.current = hoverIndex
    redrawRef.current?.()
  }, [hoverIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let gl
    let program
    const buffers = []
    try {
      gl = canvas.getContext('webgl', { alpha: false, antialias: true, powerPreference: 'low-power' })
      if (!gl) throw new Error('WebGL is unavailable.')

      const vertex = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
      const fragment = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER)
      program = gl.createProgram()
      if (!program) throw new Error('Could not create a WebGL program.')
      gl.attachShader(program, vertex)
      gl.attachShader(program, fragment)
      gl.linkProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Could not link the WebGL program.')

      const pointAttribute = gl.getAttribLocation(program, 'aPoint')
      const pointModeUniform = gl.getUniformLocation(program, 'uPointMode')
      const lineModeUniform = gl.getUniformLocation(program, 'uLineMode')
      const rotationUniform = gl.getUniformLocation(program, 'uRotation')
      const selectedPointUniform = gl.getUniformLocation(program, 'uSelectedPoint')
      const selectedModeUniform = gl.getUniformLocation(program, 'uSelectedMode')
      const boundaryModeUniform = gl.getUniformLocation(program, 'uBoundaryMode')
      if (pointAttribute < 0 || !pointModeUniform || !lineModeUniform || !rotationUniform || !selectedPointUniform || !selectedModeUniform || !boundaryModeUniform) {
        throw new Error('WebGL could not bind the surface shader.')
      }

      const mesh = makeSurface(32, model, probability)
      const samplePoints = makeSamplePoints(samples, model, probability)
      const boundary = makeBoundary(model)
      const pointBuffer = gl.createBuffer()
      const triangleBuffer = gl.createBuffer()
      const lineBuffer = gl.createBuffer()
      const sampleBuffer = gl.createBuffer()
      const boundaryBuffer = gl.createBuffer()
      if (!pointBuffer || !triangleBuffer || !lineBuffer || !sampleBuffer || !boundaryBuffer) throw new Error('WebGL could not allocate surface buffers.')
      buffers.push(pointBuffer, triangleBuffer, lineBuffer, sampleBuffer, boundaryBuffer)

      gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, mesh.points, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.triangles, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer)
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.lines, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, sampleBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, samplePoints, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, boundaryBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, boundary.points, gl.STATIC_DRAW)

      gl.useProgram(program)
      gl.enable(gl.DEPTH_TEST)
      gl.depthFunc(gl.LEQUAL)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      gl.clearColor(8 / 255, 11 / 255, 20 / 255, 1)

      const bindPointAttribute = (buffer) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.enableVertexAttribArray(pointAttribute)
        gl.vertexAttribPointer(pointAttribute, 4, gl.FLOAT, false, 0, 0)
      }
      const draw = () => {
        const bounds = canvas.getBoundingClientRect()
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
        const width = Math.max(1, Math.round(bounds.width * ratio))
        const height = Math.max(1, Math.round(bounds.height * ratio))
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
        }
        gl.viewport(0, 0, width, height)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.uniform2f(rotationUniform, rotationRef.current.x, rotationRef.current.y)
        gl.uniform1f(selectedModeUniform, 0)
        gl.uniform1f(boundaryModeUniform, 0)
        bindPointAttribute(pointBuffer)
        gl.uniform1f(pointModeUniform, 0)
        gl.uniform1f(lineModeUniform, 0)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer)
        gl.drawElements(gl.TRIANGLES, mesh.triangles.length, gl.UNSIGNED_SHORT, 0)
        gl.uniform1f(lineModeUniform, 1)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineBuffer)
        gl.drawElements(gl.LINES, mesh.lines.length, gl.UNSIGNED_SHORT, 0)
        if (boundary.count) {
          bindPointAttribute(boundaryBuffer)
          gl.uniform1f(boundaryModeUniform, 1)
          gl.disable(gl.DEPTH_TEST)
          gl.drawArrays(gl.LINES, 0, boundary.count)
          gl.enable(gl.DEPTH_TEST)
          gl.uniform1f(boundaryModeUniform, 0)
        }
        bindPointAttribute(sampleBuffer)
        gl.uniform1f(pointModeUniform, 1)
        gl.uniform1f(lineModeUniform, 0)
        const highlightIndex = hoverRef.current ?? selectedRef.current
        const highlighted = samples[highlightIndex]
        if (highlighted) {
          gl.uniform2f(selectedPointUniform, highlighted[0], highlighted[1])
          gl.uniform1f(selectedModeUniform, 1)
        }
        gl.drawArrays(gl.POINTS, 0, samples.length)
      }
      redrawRef.current = draw

      const findSample = (event) => {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        let nearest = -1
        let nearestDistance = 22
        samples.forEach((sample, index) => {
          const point = projectSample(sample, rotationRef.current, rect.width, rect.height, probability(model, sample[0], sample[1]))
          const distance = Math.hypot(point.x - x, point.y - y)
          if (distance < nearestDistance) { nearestDistance = distance; nearest = index }
        })
        return nearest
      }
      const onPointerDown = (event) => {
        if (event.button !== undefined && event.button !== 0) return
        dragRef.current = { x: event.clientX, y: event.clientY, rotation: { ...rotationRef.current }, moved: false }
        canvas.setPointerCapture?.(event.pointerId)
      }
      const onPointerMove = (event) => {
        if (dragRef.current) {
          const dx = event.clientX - dragRef.current.x
          const dy = event.clientY - dragRef.current.y
          if (Math.abs(dx) + Math.abs(dy) > 2) dragRef.current.moved = true
          rotationRef.current = {
            x: Math.max(-0.35, Math.min(1.25, dragRef.current.rotation.x - dy * 0.006)),
            y: Math.max(-0.95, Math.min(0.95, dragRef.current.rotation.y + dx * 0.006)),
          }
          draw()
          return
        }
        const index = findSample(event)
        if (index !== hoverRef.current) {
          hoverRef.current = index < 0 ? null : index
          setHoverIndex(hoverRef.current)
          draw()
        }
      }
      const onPointerUp = (event) => {
        if (!dragRef.current) return
        const wasDragged = dragRef.current.moved
        dragRef.current = null
        if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId)
        if (!wasDragged) {
          const index = findSample(event)
          if (index >= 0) { setSelectedIndex(index); setHoverIndex(index) }
        }
      }
      const onPointerLeave = () => {
        if (dragRef.current) return
        hoverRef.current = null
        setHoverIndex(null)
        draw()
      }
      const onKeyDown = (event) => {
        const step = event.shiftKey ? 0.18 : 0.09
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault()
          rotationRef.current.y = Math.max(-0.95, Math.min(0.95, rotationRef.current.y + (event.key === 'ArrowLeft' ? -step : step)))
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
          event.preventDefault()
          rotationRef.current.x = Math.max(-0.35, Math.min(1.25, rotationRef.current.x + (event.key === 'ArrowUp' ? -step : step)))
        } else return
        draw()
      }

      const observer = new ResizeObserver(draw)
      observer.observe(canvas)
      canvas.addEventListener('pointerdown', onPointerDown)
      canvas.addEventListener('pointermove', onPointerMove)
      canvas.addEventListener('pointerup', onPointerUp)
      canvas.addEventListener('pointercancel', onPointerUp)
      canvas.addEventListener('pointerleave', onPointerLeave)
      canvas.addEventListener('keydown', onKeyDown)
      draw()
      setFailed(false)

      return () => {
        observer.disconnect()
        canvas.removeEventListener('pointerdown', onPointerDown)
        canvas.removeEventListener('pointermove', onPointerMove)
        canvas.removeEventListener('pointerup', onPointerUp)
        canvas.removeEventListener('pointercancel', onPointerUp)
        canvas.removeEventListener('pointerleave', onPointerLeave)
        canvas.removeEventListener('keydown', onKeyDown)
        if (redrawRef.current === draw) redrawRef.current = null
        buffers.forEach((buffer) => gl.deleteBuffer(buffer))
        gl.deleteProgram(program)
      }
    } catch {
      buffers.forEach((buffer) => { if (gl && buffer) gl.deleteBuffer(buffer) })
      if (gl && program) gl.deleteProgram(program)
      setFailed(true)
      onFallback()
      return undefined
    }
  }, [model, onFallback, probability, samples])

  if (failed) return <div className="experiment-surface-fallback" role="status">WebGL is unavailable. The 2D probability map is ready.</div>

  const activeIndex = hoverIndex ?? Math.min(selectedIndex, Math.max(0, samples.length - 1))
  const [x, y, label] = samples[activeIndex] || [0, 0, 0]
  const pointProbability = probability(model, x, y)
  const description = `Sample ${String(activeIndex + 1).padStart(2, '0')}: Class ${label ? 'B' : 'A'}, feature x1 ${x.toFixed(2)}, feature x2 ${y.toFixed(2)}, probability of class B ${pointProbability.toFixed(2)}.`
  const selectedSampleIndex = Math.min(selectedIndex, Math.max(0, samples.length - 1))
  const [selectedX, selectedY, selectedLabel] = samples[selectedSampleIndex] || [0, 0, 0]
  const selectedDescription = `Selected sample ${String(selectedSampleIndex + 1).padStart(2, '0')}: Class ${selectedLabel ? 'B' : 'A'}, x1 ${selectedX.toFixed(2)}, x2 ${selectedY.toFixed(2)}, probability of Class B ${probability(model, selectedX, selectedY).toFixed(2)}.`

  return (
    <figure className="experiment-surface-figure" aria-label={`Interactive three-dimensional classifier probability surface and decision boundary after ${model.step} training steps.`}>
      <canvas
        className="experiment-surface-canvas"
        ref={canvasRef}
        role="img"
        tabIndex={0}
        aria-label="Interactive 3D probability surface. Drag to rotate, click a sample to inspect, or use arrow keys."
        aria-describedby="experiment-surface-hint"
      />
      <div className="experiment-surface-overlay">
        <span id="experiment-surface-hint">DRAG TO ROTATE / SELECT A POINT</span>
        <button type="button" aria-label="Reset 3D surface view" title="Reset view" onClick={() => { rotationRef.current = { x: 0.62, y: -0.22 }; redrawRef.current?.() }}><RotateCcw size={13} aria-hidden="true" /></button>
      </div>
      <div className="experiment-surface-inspector">
        <label htmlFor="experiment-sample-select">Inspect sample</label>
        <select id="experiment-sample-select" value={selectedSampleIndex} onChange={(event) => setSelectedIndex(Number(event.target.value))}>
          {samples.map(([sampleX, sampleY, sampleLabel], index) => <option value={index} key={`${index}-${sampleX}-${sampleY}`}>Sample {String(index + 1).padStart(2, '0')} / Class {sampleLabel ? 'B' : 'A'}</option>)}
        </select>
        <span aria-hidden="true">{description}</span>
        <p className="experiment-surface-live" role="status">{selectedDescription}</p>
      </div>
      <figcaption>Drag to change the view. Height and color show the model's probability of Class B across the two input features.</figcaption>
    </figure>
  )
}
