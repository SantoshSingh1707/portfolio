import * as k from '../kit/iso-kit.mjs'
import * as A from '../kit/audit.mjs'
import { turning } from '../kit/turn-build.mjs'

export const WIDTH = 1180
export const HEIGHT = 460
const MAX_RADIUS = 85
const CAMERA_POINTS = Array.from({ length: 72 }, (_, index) => {
  const angle = (index / 72) * Math.PI * 2
  const x = Math.cos(angle) * MAX_RADIUS
  const y = Math.sin(angle) * MAX_RADIUS
  return [[x, y, -4], [x, y, 19.4]]
}).flat()

export const P = k.fitProjection(CAMERA_POINTS, WIDTH, HEIGHT, {
  pad: 20,
  azimuth: 42,
  elevation: 17,
})

export const recorder = A.recorder(P)
export const T = turning(P, { recorder })
const router = T.group('router', { turn: { pivot: [0, 0] } })
const layer = T.layer('router')
T.stack(['router'])

const vertical = (x, y) => ({ o: [x, y, 0], a: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] })
const basePart = { group: router, layer }
const post = (name, x, y, z0, z1, radius, options = {}) => T.round({
  ...basePart,
  name,
  F: vertical(x, y),
  s0: z0,
  s1: z1,
  r: radius,
  ...options,
})
const slab = (name, plan, z, height, options = {}) => T.prism({
  ...basePart,
  name,
  plan,
  z,
  h: height,
  steps: 8,
  bevel: 0.5,
  ...options,
})

const BASE = { x: -67, y: -49, w: 134, d: 98, r: 5 }
const PLATTER_TOP = 5.2
const BOARD_BOTTOM = 6.3
const BOARD_TOP = 7.6

// The base and turntable are one rotating assembly. Every upper part lands on
// the surface below it; the bearing pads remain visible around the platter.
slab('stand.chassis.deck', BASE, 0, 2.4, { material: 'gunmetal', bevel: 0.8 })
for (let index = 0; index < 8; index++) {
  const angle = (index / 8) * Math.PI * 2 + Math.PI / 8
  post(`bearing.roller.${index + 1}`, Math.cos(angle) * 43, Math.sin(angle) * 43, 2.4, 3.4, 1.4, {
    material: 'chrome', tone: 'mid', crease: 'lo',
  })
}
post('bearing.spindle', 0, 0, 2.4, 3.4, 2.1, { material: 'steel', tone: 'mid' })
post('turntable.platter', 0, 0, 3.4, PLATTER_TOP, 45, { material: 'gunmetal', tone: 'mid', crease: 'lo' })
for (const [index, [x, y]] of [[-56, -37], [56, -37], [-56, 37], [56, 37]].entries()) {
  post(`stand.foot.${index + 1}`, x, y, -4, 0, 3.2, { material: 'rubber', tone: 'lo' })
}

// Four supports suspend the circuit backplane above the platter. A perimeter
// guard connects to the chassis outside the rotating board's circular envelope.
for (const [index, [x, y]] of [[-32, -22], [32, -22], [-32, 22], [32, 22]].entries()) {
  post(`backplane.standoff.${index + 1}`, x, y, PLATTER_TOP, BOARD_BOTTOM, 1.35, {
    material: 'steel', tone: 'mid', crease: 'none',
  })
}
slab('router.backplane', { x: -36, y: -28, w: 72, d: 56, r: 2.2 }, BOARD_BOTTOM, BOARD_TOP - BOARD_BOTTOM, {
  material: 'gunmetal', tone: 'mid', crease: 'faint', bevel: 0.35,
})

const FRAME = [[-60, -41], [60, -41], [-60, 41], [60, 41]]
for (const [index, [x, y]] of FRAME.entries()) {
  post(`guard.upright.${index + 1}`, x, y, 2.4, 16, 1.7, { material: 'steel', tone: 'mid' })
  const braceX = x - Math.sign(x) * 3.16
  post(`guard.brace.${index + 1}`, braceX, y, 2.4, 4.4, 1.4, { material: 'chrome', tone: 'lo' })
}
for (const [index, y] of [-41, 41].entries()) {
  slab(`guard.crossrail.${index + 1}`, { x: -60, y: y - 1.3, w: 120, d: 2.6, r: 1 }, 16, 2.5, {
    material: 'steel', tone: 'hi', crease: 'lo', bevel: 0.3,
  })
}
for (const [index, [x, y]] of [[-45, -41], [45, -41], [-45, 41], [45, 41]].entries()) {
  post(`guard.bolt.${index + 1}`, x, y, 18.5, 19.2, 0.75, { material: 'chrome', tone: 'hi', crease: 'none' })
}

const LAYERS = [
  { x: -21.5, count: 4 },
  { x: -7.2, count: 8 },
  { x: 7.2, count: 6 },
  { x: 21.5, count: 4 },
]
const rowY = (count) => Array.from({ length: count }, (_, index) => (index - (count - 1) / 2) * (count === 8 ? 6 : count === 6 ? 7.2 : 9))
export const NODES = LAYERS.flatMap((item, layerIndex) => rowY(item.count).map((y, index) => ({
  id: `${layerIndex}-${index}`,
  layer: layerIndex,
  index,
  x: item.x,
  y,
})))

for (const node of NODES) {
  post(`node.${node.id}.housing`, node.x, node.y, BOARD_TOP, 8.6, 1.5, {
    material: 'steel', tone: 'mid', crease: 'lo',
  })
  T.ball({ ...basePart, name: `node.${node.id}.core`, c: [node.x, node.y, 9.35], r: 0.75,
    material: 'chrome', tone: 'hi', lit: true })
}

// Each category gets an input and output jack: three tangible parts per port.
const INPUT_Y = rowY(4)
for (const side of [-1, 1]) {
  for (const [index, y] of INPUT_Y.entries()) {
    const x = side * 31
    const direction = side < 0 ? 'in' : 'out'
    post(`port.${direction}.${index + 1}.shell`, x, y, BOARD_TOP, 8.7, 1.8, {
      material: 'steel', tone: 'mid', crease: 'lo',
    })
    post(`port.${direction}.${index + 1}.collar`, x, y, 8.7, 9.2, 1.3, {
      material: 'chrome', tone: 'hi', crease: 'lo',
    })
    T.ball({ ...basePart, name: `port.${direction}.${index + 1}.pin`, c: [x, y, 9.85], r: 0.65,
      material: 'chrome', tone: 'hi', lit: true })
  }
}

// A knurled physical selector and four pathway indicator lamps sit on the
// exposed platter lip, clear of the elevated network board.
post('selector.bezel', 0, -37, PLATTER_TOP, 6.2, 2.4, { material: 'chrome', tone: 'mid' })
post('selector.cap', 0, -37, 6.2, 8.1, 1.45, { material: 'chrome', tone: 'hi', crease: 'lo' })
const LAMPS = [-24, -8, 8, 24].map((x) => [x, 24])
for (const [index, [x, y]] of LAMPS.entries()) {
  T.ball({ ...basePart, name: `indicator.${index + 1}`, c: [x, y, 8.45], r: 0.85,
    material: 'chrome', tone: 'hi', lit: true })
}

const keyOf = (node) => `${node.layer}-${node.index}`
const edges = NODES.filter((node) => node.layer < 3).flatMap((from) =>
  NODES.filter((to) => to.layer === from.layer + 1).map((to) => ({ from, to })),
)
const number = (value) => Number(value.toFixed(2))
const route = (from, to) => {
  const reach = (to.x - from.x) * 0.43
  return `M${number(from.x)} ${number(from.y)}C${number(from.x + reach)} ${number(from.y)} ${number(to.x - reach)} ${number(to.y)} ${number(to.x)} ${number(to.y)}`
}
const inputNodes = NODES.filter((node) => node.layer === 0).sort((a, b) => a.index - b.index)
const outputNodes = NODES.filter((node) => node.layer === 3).sort((a, b) => a.index - b.index)
const portSegment = (node, side) => {
  const port = { x: side * 31, y: node.y }
  return side < 0 ? route(port, node) : route(node, port)
}
const baseTraces = [
  ...edges.map(({ from, to }) => `<path class="nw-trace" d="${route(from, to)}"/>`),
  ...inputNodes.map((node) => `<path class="nw-trace nw-trace--lead" d="${portSegment(node, -1)}"/>`),
  ...outputNodes.map((node) => `<path class="nw-trace nw-trace--lead" d="${portSegment(node, 1)}"/>`),
].join('')

const MODES = Array.from({ length: 4 }, (_, mode) => {
  const selectedNodes = NODES.filter((node) => {
    if (node.layer === 0 || node.layer === 3) return node.index === mode
    if (node.layer === 1) return node.index === (mode * 2) % 8 || node.index === (mode * 2 + 3) % 8
    return node.index === mode % 6 || node.index === (mode + 2) % 6
  })
  const selected = new Set(selectedNodes.map(keyOf))
  const traces = edges.filter(({ from, to }) => selected.has(keyOf(from)) && selected.has(keyOf(to)))
    .map(({ from, to }) => `<path class="nw-active-trace" data-flow="" d="${route(from, to)}"/>`).join('')
  const leads = [inputNodes[mode], outputNodes[mode]].map((node, index) =>
    `<path class="nw-active-trace nw-active-trace--lead" data-flow="" d="${portSegment(node, index === 0 ? -1 : 1)}"/>`,
  ).join('')
  const halos = selectedNodes.map((node) =>
    `<circle class="nw-node-halo" cx="${node.x}" cy="${node.y}" r="2.2"/>`,
  ).join('')
  const lamp = LAMPS[mode]
  const lampHalo = `<circle class="nw-lamp-halo" cx="${lamp[0]}" cy="${lamp[1]}" r="1.65"/>`
  return `<g class="nw-mode-traces nw-mode-traces--${mode}">${traces}${leads}${halos}${lampHalo}</g>`
}).join('')

const silkscreen = `
  <text class="nw-silkscreen" text-anchor="middle" x="0" y="-24.6">INPUTS</text>
  <text class="nw-silkscreen" text-anchor="middle" x="0" y="23.5">ROUTING CORE</text>
  <text class="nw-silkscreen nw-silkscreen--edge" text-anchor="middle" x="-30.8" y="-24.6">IN</text>
  <text class="nw-silkscreen nw-silkscreen--edge" text-anchor="middle" x="30.8" y="-24.6">OUT</text>`

T.plane({
  part: T.parts.find((part) => part.name === 'router.backplane'),
  o: [0, 0, BOARD_TOP + 0.012],
  u: [1, 0, 0],
  v: [0, 1, 0],
  normal: [0, 0, 1],
  fade: [0.04, 0.3],
  svg: `<g class="nw-trace-layer">${baseTraces}${silkscreen}${MODES}</g>`,
})

export const poses = () => Array.from({ length: 36 }, (_, index) => ({ router: index * 10 }))
export const OUT = T.build({ statics: recorder.items, poses })
export const ROUTER_DATA = OUT.data
export const ROUTER_REPORT = OUT.report
export const ROUTER_SVG = OUT.layerSvg('router', { width: WIDTH, height: HEIGHT })

