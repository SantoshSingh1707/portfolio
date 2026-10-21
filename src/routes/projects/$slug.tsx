import { createFileRoute } from '@tanstack/react-router'
import ProjectDetail from '../../pages/ProjectDetail'

function ProjectRoute() {
  const { slug } = Route.useParams()
  return <ProjectDetail slug={slug} />
}

export const Route = createFileRoute('/projects/$slug')({
  head: ({ params }) => {
    const projectTitles: Record<string, string> = {
      'ai-study-tool': 'AI Study Tool',
      'code-review-agent': 'Code Review Agent',
      'house-price-model': 'House Price Model',
      'truthlens-ai': 'TruthLens AI',
    }
    const projectTitle = projectTitles[params.slug] ?? 'Project notebook'
    return {
      meta: [
        { title: `${projectTitle} — Santosh Singh` },
        { name: 'description', content: `Project notes and implementation details for ${projectTitle}, by Santosh Singh.` },
      ],
    }
  },
  component: ProjectRoute,
})
