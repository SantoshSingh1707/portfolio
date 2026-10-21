import { createFileRoute } from '@tanstack/react-router'
import Lab from '../pages/Lab'

export const Route = createFileRoute('/lab')({
  head: () => ({
    meta: [
      { title: 'Lab — Santosh Singh' },
      { name: 'description', content: 'Train a small logistic-regression classifier, change its data, and inspect how its decision surface responds.' },
    ],
  }),
  component: Lab,
})
