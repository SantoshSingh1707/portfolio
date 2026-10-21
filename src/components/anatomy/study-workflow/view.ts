import { fitProjection, iso, type Plan, type Point3, type Projection } from '../kit/iso-kit'

export const WIDTH = 720
export const HEIGHT = 398
export const AZIMUTH = 52
export const ELEVATION = 31

export const BASE: Plan = { x: -174, y: -86, w: 328, d: 172, r: 8 }
export const FEEDER: Plan = { x: -154, y: -39, w: 72, d: 57, r: 3 }
export const INDEX_CASE: Plan = { x: -54, y: 12, w: 77, d: 66, r: 3 }
export const MODEL_CASE: Plan = { x: 48, y: 12, w: 74, d: 66, r: 4 }

export const RAIL_X = -145
export const RAIL_END = 110
export const RAIL_Z = 42
export const CARRIAGE_Z = 47
export const CARRIAGE_START_X = 0

const corners = ({ x, y, w, d }: Plan, z0: number, z1: number): Point3[] => {
  const points: Point3[] = []
  for (const px of [x, x + w]) for (const py of [y, y + d]) for (const z of [z0, z1]) points.push([px, py, z])
  return points
}

const points = [
  ...corners(BASE, -18, 0),
  ...corners(FEEDER, 0, 22),
  ...corners(INDEX_CASE, 0, 27),
  ...corners(MODEL_CASE, 0, 54),
  ...corners({ x: RAIL_X, y: -22, w: RAIL_END - RAIL_X, d: 30, r: 0 }, 0, 52),
]

export const P: Projection = fitProjection(points, WIDTH, HEIGHT, { pad: 30, azimuth: AZIMUTH, elevation: ELEVATION })
export const at = (point: Point3) => iso(point, P)

