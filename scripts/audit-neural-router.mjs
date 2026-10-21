import * as TA from '../src/components/anatomy/kit/turn-audit.mjs'
import { P, T, recorder, poses } from '../src/components/anatomy/neural-router/geometry.mjs'

const only = process.argv.find((argument) => argument.startsWith('--only='))?.slice('--only='.length).split(',') ?? null
const step = Number(process.argv.find((argument) => argument.startsWith('--step='))?.slice('--step='.length) ?? '0.05')

TA.orbitOrExit(T, recorder, P, {
  argv: ['--audit'],
  sweep: { at: (angle) => ({ router: angle }), from: 0, to: 360, frame: 0.3 },
  poses,
  only,
  step,
  quick: process.argv.includes('--quick'),
  log: process.argv.includes('--verbose') ? console.log : null,
})
