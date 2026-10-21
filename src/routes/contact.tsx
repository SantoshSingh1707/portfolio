import { createFileRoute } from '@tanstack/react-router'
import Contact from '../pages/Contact'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: [
      { title: 'Contact Santosh Singh — AI & ML Student' },
      { name: 'description', content: 'Start a conversation with Santosh Singh about a project idea, an internship, or AI and machine learning.' },
    ],
  }),
  component: Contact,
})
