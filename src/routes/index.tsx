import { createFileRoute } from '@tanstack/react-router'
import Home from '../pages/Home'
import portraitAvif from '../assets/me.avif'

export const Route = createFileRoute('/')({
  head: () => ({
    links: [{ rel: 'preload', as: 'image', type: 'image/avif', href: portraitAvif, fetchPriority: 'high' }],
    meta: [
      { title: 'Santosh Singh — AI/ML Student' },
      { name: 'description', content: 'Explore Santosh Singh’s interactive AI/ML portfolio: practical projects, working experiments, and the learning journey of a DIT student.' },
    ],
  }),
  component: Home,
})
