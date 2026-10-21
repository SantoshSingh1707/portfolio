import { createFileRoute } from '@tanstack/react-router'
import About from '../pages/About'
import portraitAvif from '../assets/me.avif'

export const Route = createFileRoute('/about')({
  head: () => ({
    links: [{ rel: 'preload', as: 'image', type: 'image/avif', href: portraitAvif, fetchPriority: 'high' }],
    meta: [
      { title: 'About Santosh Singh — AI/ML Student & Developer' },
      { name: 'description', content: 'Meet Santosh Singh, an AI/ML student at DIT University in Dehradun, and explore the projects, experience, and tools behind his work.' },
    ],
  }),
  component: About,
})
