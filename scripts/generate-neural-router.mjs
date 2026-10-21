import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { ROUTER_DATA, ROUTER_REPORT, ROUTER_SVG } from '../src/components/anatomy/neural-router/geometry.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const scene = {
  data: ROUTER_DATA,
  svg: ROUTER_SVG,
  report: {
    parts: ROUTER_REPORT.parts,
    groups: ROUTER_REPORT.groups,
    seconds: ROUTER_REPORT.seconds,
    tight: ROUTER_REPORT.tight,
  },
}

await writeFile(
  resolve(root, 'src/components/anatomy/neural-router/scene.generated.json'),
  `${JSON.stringify(scene)}\n`,
)
console.log(`Generated project-pathway router (${scene.report.parts} parts).`)
