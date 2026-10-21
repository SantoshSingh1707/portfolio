import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'
import Projects from '../pages/Projects'

function ProjectsRouteContent() {
  const hasProjectDetail = useRouterState({
    select: (state) => state.matches.some((match) => match.routeId === '/projects/$slug'),
  })

  return hasProjectDetail ? <Outlet /> : <Projects />
}

export const Route = createFileRoute('/projects')({
  head: () => ({
    meta: [
      { title: 'Projects — Santosh Singh | AI & Machine Learning' },
      { name: 'description', content: 'Explore Santosh Singh’s AI and machine learning projects: a retrieval-based study tool, local code review agent, reproducible model pipeline, and image-analysis experiments.' },
    ],
  }),
  component: ProjectsRouteContent,
})
