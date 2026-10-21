import {
  cylinder,
  insetPlan,
  joinPaths,
  onTop,
  pathOf,
  planOutline,
  ring,
  slabOf,
  topTicks,
  type Flat,
  type Plan,
  type Point3,
} from '../kit/iso-kit'
import { BASE, CARRIAGE_Z, FEEDER, INDEX_CASE, MODEL_CASE, P, RAIL_END, RAIL_X, RAIL_Z, at } from './view'

const slab = (plan: Plan, z: number, h: number, bevel = 0.55, steps = 6) => slabOf(plan, z, h, P, steps, bevel)
const topLine = (a: Flat, b: Flat, z: number) => onTop([a, b], z, P)
const edge = (a: Point3, b: Point3) => pathOf([at(a), at(b)])
const flatPath = (points: Point3[], closed = false) => pathOf(points.map(at), closed)
const screws = (points: Flat[], z: number, radius = 1.4) => ({
  rings: joinPaths(points.map(([x, y]) => ring(x, y, radius, z, P, 14))),
  dots: points.map(([x, y]) => at([x, y, z])),
})

export const BASE_ART = (() => {
  const pan = slab(BASE, -12, 12, 1.4, 8)
  const footSpots: Flat[] = [
    [BASE.x + 16, BASE.y + 16],
    [BASE.x + BASE.w - 16, BASE.y + 16],
    [BASE.x + 16, BASE.y + BASE.d - 16],
    [BASE.x + BASE.w - 16, BASE.y + BASE.d - 16],
  ]
  const boltSpots: Flat[] = [
    [BASE.x + 8, BASE.y + 8],
    [BASE.x + BASE.w - 8, BASE.y + 8],
    [BASE.x + 8, BASE.y + BASE.d - 8],
    [BASE.x + BASE.w - 8, BASE.y + BASE.d - 8],
  ]
  const idPlate: Plan = { x: BASE.x + 17, y: BASE.y + 8, w: 41, d: 10, r: 1.5 }
  return {
    pan,
    halo: slab(BASE, -12, 12, 0, 4).fill,
    feet: footSpots.map(([x, y]) => [cylinder(x, y, 6.3, -18, 1.4, P, 18), cylinder(x, y, 4.7, -16.6, 4.6, P, 18)]),
    groove: planOutline(insetPlan(BASE, 4.5), 0, P),
    bevel: slab({ x: BASE.x + 5, y: BASE.y + BASE.d - 4, w: BASE.w - 10, d: 1.8, r: 0.6 }, 0.05, 0.65, 0.2, 4),
    bolts: screws(boltSpots, 0, 1.6),
    idPlate: slab(idPlate, 0, 0.8, 0.2, 4),
    idOutline: planOutline(insetPlan(idPlate, 1.5), 0.8, P),
    idRules: [
      topLine([idPlate.x + 5, idPlate.y + 2.7], [idPlate.x + 34, idPlate.y + 2.7], 0.8),
      topLine([idPlate.x + 5, idPlate.y + 5], [idPlate.x + 29, idPlate.y + 5], 0.8),
      topLine([idPlate.x + 5, idPlate.y + 7.2], [idPlate.x + 24, idPlate.y + 7.2], 0.8),
    ].join(''),
    idScrews: screws([[idPlate.x + 3, idPlate.y + 5], [idPlate.x + idPlate.w - 3, idPlate.y + 5]], 0.8, 0.9),
  }
})()

const PORTAL_LEFT: Plan = { x: -146, y: -18, w: 7, d: 30, r: 1.2 }
const PORTAL_RIGHT: Plan = { x: 104, y: -18, w: 7, d: 30, r: 1.2 }
const RAIL_NEAR: Plan = { x: RAIL_X, y: -20, w: RAIL_END - RAIL_X, d: 4.5, r: 1 }
const RAIL_FAR: Plan = { x: RAIL_X, y: 5, w: RAIL_END - RAIL_X, d: 4.5, r: 1 }
const RULE_STRIP: Plan = { x: -126, y: 7.4, w: 215, d: 4.2, r: 0.7 }
const RULES = topTicks(-124, 86, 6, 5, RULE_STRIP.y + 0.3, RAIL_Z + 5.2, [1.15, 2.25], P)

export const FRAME_ART = {
  uprights: [slab(PORTAL_LEFT, 0, 42, 0.7, 4), slab(PORTAL_RIGHT, 0, 42, 0.7, 4)],
  supportLines: [
    edge([-139, -17, 5], [-139, -17, 38]),
    edge([111, -17, 5], [111, -17, 38]),
  ].join(''),
  crossbeam: slab({ x: -145, y: 8, w: 255, d: 6, r: 1.2 }, 43, 5, 0.6, 4),
  rails: [slab(RAIL_NEAR, RAIL_Z, 5, 0.7, 4), slab(RAIL_FAR, RAIL_Z, 5, 0.7, 4)],
  railSeams: [planOutline(insetPlan(RAIL_NEAR, 1), RAIL_Z + 5, P), planOutline(insetPlan(RAIL_FAR, 1), RAIL_Z + 5, P)].join(''),
  stops: [
    slab({ x: RAIL_X - 2, y: -22, w: 8, d: 34, r: 1.4 }, RAIL_Z + 5, 2.8, 0.4, 4),
    slab({ x: RAIL_END - 5, y: -22, w: 8, d: 34, r: 1.4 }, RAIL_Z + 5, 2.8, 0.4, 4),
  ],
  bushings: [
    slab({ x: -129, y: -20, w: 9, d: 5, r: 1.3 }, RAIL_Z + 5, 1.6, 0.4, 4),
    slab({ x: -129, y: 5, w: 9, d: 5, r: 1.3 }, RAIL_Z + 5, 1.6, 0.4, 4),
    slab({ x: 91, y: -20, w: 9, d: 5, r: 1.3 }, RAIL_Z + 5, 1.6, 0.4, 4),
    slab({ x: 91, y: 5, w: 9, d: 5, r: 1.3 }, RAIL_Z + 5, 1.6, 0.4, 4),
  ],
  ruler: slab(RULE_STRIP, RAIL_Z + 5, 0.8, 0.2, 4),
  rulerMinor: RULES.minor,
  rulerMajor: RULES.major,
  zero: edge([-126, RULE_STRIP.y + 0.3, RAIL_Z + 5.8], [-126, RULE_STRIP.y + 0.3, RAIL_Z + 2.8]),
  boltPoints: [
    at([-140, -16, 42]), at([-140, 10, 42]), at([107, -16, 42]), at([107, 10, 42]),
  ],
}

const SCAN_BED: Plan = { x: FEEDER.x + 7, y: FEEDER.y + 8, w: FEEDER.w - 14, d: FEEDER.d - 17, r: 1.2 }
const FEEDER_COVER: Plan = { x: FEEDER.x + 5, y: FEEDER.y + FEEDER.d - 15, w: FEEDER.w - 10, d: 12, r: 2 }
const FILE_CARD: Plan = { x: FEEDER.x + 19, y: FEEDER.y + 19, w: 37, d: 24, r: 1 }
const feedRoller = (cx: number, cy: number) => cylinder(cx, cy, 4.2, 2.2, 3, P, 24, 0.45)

export const FEEDER_ART = {
  tray: slab(FEEDER, 0, 2, 0.65, 6),
  trayInner: planOutline(insetPlan(FEEDER, 3), 2, P),
  lip: slab({ x: FEEDER.x + 4, y: FEEDER.y + FEEDER.d - 3, w: FEEDER.w - 8, d: 2, r: 0.6 }, 2, 2, 0.35, 4),
  guides: [
    slab({ x: FEEDER.x + 3, y: FEEDER.y + 6, w: 3.5, d: 40, r: 1 }, 2, 2.4, 0.35, 4),
    slab({ x: FEEDER.x + FEEDER.w - 6.5, y: FEEDER.y + 6, w: 3.5, d: 40, r: 1 }, 2, 2.4, 0.35, 4),
  ],
  rollers: [feedRoller(FEEDER.x + 13, FEEDER.y + 9), feedRoller(FEEDER.x + FEEDER.w - 13, FEEDER.y + 9)],
  rollerRings: joinPaths([
    ring(FEEDER.x + 13, FEEDER.y + 9, 3, 5.2, P, 24),
    ring(FEEDER.x + FEEDER.w - 13, FEEDER.y + 9, 3, 5.2, P, 24),
  ]),
  motor: cylinder(FEEDER.x + 11, FEEDER.y + FEEDER.d - 10, 5.2, 5, 6, P, 24, 0.5),
  bed: slab(SCAN_BED, 2.2, 1.4, 0.2, 4),
  bridge: [
    slab({ x: FEEDER.x + 16, y: FEEDER.y + 12, w: 4, d: 4, r: 0.6 }, 4, 13, 0.5, 4),
    slab({ x: FEEDER.x + FEEDER.w - 20, y: FEEDER.y + 12, w: 4, d: 4, r: 0.6 }, 4, 13, 0.5, 4),
    slab({ x: FEEDER.x + 16, y: FEEDER.y + 12, w: FEEDER.w - 32, d: 4, r: 0.6 }, 16, 3.2, 0.45, 4),
  ],
  window: slab({ x: FEEDER.x + 31, y: FEEDER.y + 12.8, w: 10, d: 2.3, r: 1 }, 16.3, 0.8, 0.2, 4),
  cover: slab(FEEDER_COVER, 2.1, 1.7, 0.5, 5),
  hinges: [
    cylinder(FEEDER.x + 14, FEEDER.y + FEEDER.d - 12, 1.1, 3.4, 3.2, P, 14),
    cylinder(FEEDER.x + FEEDER.w - 14, FEEDER.y + FEEDER.d - 12, 1.1, 3.4, 3.2, P, 14),
  ],
  card: slab(FILE_CARD, 3.7, 0.8, 0.2, 4),
  cardLines: [
    topLine([FILE_CARD.x + 5, FILE_CARD.y + 5], [FILE_CARD.x + 31, FILE_CARD.y + 5], 4.5),
    topLine([FILE_CARD.x + 5, FILE_CARD.y + 9], [FILE_CARD.x + 25, FILE_CARD.y + 9], 4.5),
    topLine([FILE_CARD.x + 5, FILE_CARD.y + 13], [FILE_CARD.x + 28, FILE_CARD.y + 13], 4.5),
  ].join(''),
}

const DRAWER_LEFT: Plan = { x: INDEX_CASE.x + 6, y: INDEX_CASE.y + 6, w: 29, d: 53, r: 1.2 }
const DRAWER_RIGHT: Plan = { x: INDEX_CASE.x + 41, y: INDEX_CASE.y + 6, w: 29, d: 53, r: 1.2 }
const CARD_LEFT: Plan = { x: DRAWER_LEFT.x + 4, y: DRAWER_LEFT.y + 9, w: DRAWER_LEFT.w - 8, d: 30, r: 0.8 }
const CARD_RIGHT: Plan = { x: DRAWER_RIGHT.x + 4, y: DRAWER_RIGHT.y + 9, w: DRAWER_RIGHT.w - 8, d: 30, r: 0.8 }

export const INDEX_ART = {
  plinth: slab(INDEX_CASE, 0, 2.4, 0.7, 5),
  cabinet: slab(INDEX_CASE, 2.4, 17.6, 0.9, 6),
  rim: planOutline(insetPlan(INDEX_CASE, 3), 20, P),
  drawers: [slab(DRAWER_LEFT, 20, 2.2, 0.35, 4), slab(DRAWER_RIGHT, 20, 2.2, 0.35, 4)],
  drawerFaces: [
    slab({ x: DRAWER_LEFT.x + 4, y: DRAWER_LEFT.y + DRAWER_LEFT.d - 7, w: DRAWER_LEFT.w - 8, d: 5, r: 0.8 }, 22.2, 1.6, 0.25, 4),
    slab({ x: DRAWER_RIGHT.x + 4, y: DRAWER_RIGHT.y + DRAWER_RIGHT.d - 7, w: DRAWER_RIGHT.w - 8, d: 5, r: 0.8 }, 22.2, 1.6, 0.25, 4),
  ],
  pulls: [
    cylinder(DRAWER_LEFT.x + DRAWER_LEFT.w / 2, DRAWER_LEFT.y + DRAWER_LEFT.d - 5, 1.7, 23.8, 1.8, P, 16, 0.2),
    cylinder(DRAWER_RIGHT.x + DRAWER_RIGHT.w / 2, DRAWER_RIGHT.y + DRAWER_RIGHT.d - 5, 1.7, 23.8, 1.8, P, 16, 0.2),
  ],
  cards: [slab(CARD_LEFT, 22.3, 0.9, 0.2, 4), slab(CARD_RIGHT, 22.3, 0.9, 0.2, 4)],
  cardLines: [CARD_LEFT, CARD_RIGHT].map((card) => [
    topLine([card.x + 3, card.y + 6], [card.x + card.w - 3, card.y + 6], 23.2),
    topLine([card.x + 3, card.y + 11], [card.x + card.w - 6, card.y + 11], 23.2),
    topLine([card.x + 3, card.y + 16], [card.x + card.w - 3, card.y + 16], 23.2),
  ].join('')).join(''),
  dividers: [
    slab({ x: INDEX_CASE.x + 37, y: INDEX_CASE.y + 4, w: 1.4, d: INDEX_CASE.d - 8, r: 0.4 }, 20.1, 1.3, 0.15, 3),
    slab({ x: INDEX_CASE.x + 4, y: INDEX_CASE.y + 4, w: INDEX_CASE.w - 8, d: 1.4, r: 0.4 }, 20.1, 1.3, 0.15, 3),
  ],
}

const CONTEXT_SOCKET: Point3 = [23, 45, 22]
const MODEL_SOCKET: Point3 = [50, 45, 26.7]
const cablePoints: Point3[] = [
  CONTEXT_SOCKET,
  [31, 42, 27],
  [42, 42, 28],
  MODEL_SOCKET,
]

const MODEL_FIN_PLANS: Plan[] = [
  { x: MODEL_CASE.x + 13, y: MODEL_CASE.y + 16, w: 6, d: 31, r: 1 },
  { x: MODEL_CASE.x + 24, y: MODEL_CASE.y + 16, w: 6, d: 31, r: 1 },
]
const SCREEN_FRAME: Plan = { x: MODEL_CASE.x + 20, y: MODEL_CASE.y + MODEL_CASE.d - 7, w: 39, d: 4, r: 1.2 }
const screenQuad = (x0: number, x1: number, y: number, z0: number, z1: number) => flatPath([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], true)
const screenLines = [
  flatPath([[SCREEN_FRAME.x + 5, SCREEN_FRAME.y + SCREEN_FRAME.d + 0.1, 33], [SCREEN_FRAME.x + 31, SCREEN_FRAME.y + SCREEN_FRAME.d + 0.1, 33]]),
  flatPath([[SCREEN_FRAME.x + 5, SCREEN_FRAME.y + SCREEN_FRAME.d + 0.1, 37], [SCREEN_FRAME.x + 26, SCREEN_FRAME.y + SCREEN_FRAME.d + 0.1, 37]]),
  flatPath([[SCREEN_FRAME.x + 5, SCREEN_FRAME.y + SCREEN_FRAME.d + 0.1, 41], [SCREEN_FRAME.x + 30, SCREEN_FRAME.y + SCREEN_FRAME.d + 0.1, 41]]),
  flatPath([[SCREEN_FRAME.x + 5, SCREEN_FRAME.y + SCREEN_FRAME.d + 0.1, 45], [SCREEN_FRAME.x + 23, SCREEN_FRAME.y + SCREEN_FRAME.d + 0.1, 45]]),
].join('')
const OUTPUT_TRAY: Plan = { x: 88, y: -66, w: 57, d: 37, r: 2 }
const QUIZ_CARD: Plan = { x: OUTPUT_TRAY.x + 6, y: OUTPUT_TRAY.y + 10, w: 21, d: 23, r: 0.8 }
const NOTE_CARD: Plan = { x: OUTPUT_TRAY.x + 30, y: OUTPUT_TRAY.y + 10, w: 21, d: 23, r: 0.8 }

export const MODEL_ART = {
  cable: flatPath(cablePoints),
  socketDots: [at(CONTEXT_SOCKET), at(MODEL_SOCKET)],
  enclosure: slab(MODEL_CASE, 0, 25, 1, 6),
  lid: slab({ x: MODEL_CASE.x + 4, y: MODEL_CASE.y + 4, w: MODEL_CASE.w - 8, d: MODEL_CASE.d - 8, r: 2 }, 25, 1.4, 0.4, 5),
  lidSeam: planOutline(insetPlan(MODEL_CASE, 5), 25.2, P),
  fins: MODEL_FIN_PLANS.map((plan) => slab(plan, 26.4, 6.2, 0.55, 4)),
  finLines: MODEL_FIN_PLANS.map((plan) => planOutline(insetPlan(plan, 1.3), 32.6, P)).join(''),
  lamp: cylinder(MODEL_CASE.x + 61, MODEL_CASE.y + 8, 1.8, 26.5, 1.6, P, 16, 0.2),
  displayStand: slab({ x: SCREEN_FRAME.x + 13, y: SCREEN_FRAME.y + 6, w: 13, d: 5, r: 1 }, 24, 3.5, 0.5, 4),
  displayFrame: slab(SCREEN_FRAME, 27, 29, 0.85, 5),
  displayGlass: screenQuad(SCREEN_FRAME.x + 3, SCREEN_FRAME.x + SCREEN_FRAME.w - 3, SCREEN_FRAME.y + SCREEN_FRAME.d + 0.05, 30, 53),
  displayRules: screenLines,
  outputTray: slab(OUTPUT_TRAY, 0, 2.2, 0.5, 5),
  outputRim: planOutline(insetPlan(OUTPUT_TRAY, 2.2), 2.2, P),
  cards: [slab(QUIZ_CARD, 2.3, 0.7, 0.2, 4), slab(NOTE_CARD, 2.3, 0.7, 0.2, 4)],
  cardRules: [QUIZ_CARD, NOTE_CARD].map((card) => [
    topLine([card.x + 3, card.y + 5], [card.x + card.w - 3, card.y + 5], 3),
    topLine([card.x + 3, card.y + 9], [card.x + card.w - 5, card.y + 9], 3),
    topLine([card.x + 3, card.y + 13], [card.x + card.w - 3, card.y + 13], 3),
    topLine([card.x + 3, card.y + 17], [card.x + card.w - 6, card.y + 17], 3),
  ].join('')).join(''),
}

const CARRIAGE: Plan = { x: -15, y: -22, w: 30, d: 34, r: 3 }

export const CARRIAGE_ART = {
  body: slab(CARRIAGE, CARRIAGE_Z + 2.2, 4, 0.8, 6),
  topInset: planOutline(insetPlan(CARRIAGE, 2.3), CARRIAGE_Z + 6.2, P),
  blocks: [
    slab({ x: -12, y: -20, w: 7, d: 5, r: 1 }, CARRIAGE_Z, 2.2, 0.4, 4),
    slab({ x: 5, y: -20, w: 7, d: 5, r: 1 }, CARRIAGE_Z, 2.2, 0.4, 4),
    slab({ x: -12, y: 4, w: 7, d: 5, r: 1 }, CARRIAGE_Z, 2.2, 0.4, 4),
    slab({ x: 5, y: 4, w: 7, d: 5, r: 1 }, CARRIAGE_Z, 2.2, 0.4, 4),
  ],
  fork: slab({ x: 5, y: -2, w: 3.2, d: 10, r: 0.7 }, 30, 16, 0.35, 4),
  pad: slab({ x: 3.2, y: -1.2, w: 6.8, d: 5.8, r: 1.2 }, 29, 1.7, 0.4, 4),
  dial: cylinder(0, -12, 4.1, CARRIAGE_Z + 6.2, 2.3, P, 24, 0.45),
  dialRing: ring(0, -12, 3.1, CARRIAGE_Z + 8.5, P, 24),
  pointer: edge([0, -12, CARRIAGE_Z + 8.7], [2.1, -12, CARRIAGE_Z + 8.7]),
  knob: cylinder(0, 6, 2.5, CARRIAGE_Z + 6.2, 2.4, P, 18, 0.25),
  cap: cylinder(0, 6, 1.1, CARRIAGE_Z + 8.6, 0.7, P, 14, 0.15),
  screws: screws([[-11.3, -17.8], [11.3, -17.8], [-11.3, 7.8], [11.3, 7.8]], CARRIAGE_Z + 6.2, 0.8),
}

export const SOCKET_ART = {
  context: cylinder(CONTEXT_SOCKET[0], CONTEXT_SOCKET[1], 2.4, 22, 1.7, P, 18, 0.25),
  model: cylinder(MODEL_SOCKET[0], MODEL_SOCKET[1], 2.4, 26.7, 1.7, P, 18, 0.25),
  contextRings: ring(CONTEXT_SOCKET[0], CONTEXT_SOCKET[1], 1.7, 23.7, P, 18),
  modelRings: ring(MODEL_SOCKET[0], MODEL_SOCKET[1], 1.7, 28.4, P, 18),
}

export const SCREEN = {
  pane: MODEL_ART.displayGlass,
  rules: MODEL_ART.displayRules,
}


