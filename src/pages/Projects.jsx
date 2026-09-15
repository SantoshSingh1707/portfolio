import { Bot, Brain, TrendingUp } from 'lucide-react'
import './Projects.css'

function Projects() {
  const projects = [
    {
      title: 'RAG-Based AI Study Tool',
      icon: <Brain size={24} />,
      technologies: ['Python', 'FastAPI', 'React', 'LangChain', 'ChromaDB'],
      description: 'Designed and deployed a full-stack Retrieval-Augmented Generation (RAG) app that converts uploaded PDFs, DOCX, and PPTX files into AI-generated quizzes, flashcards, and study notes.',
      highlights: [
        'Built semantic search pipeline using ChromaDB vector storage and Sentence-Transformer embeddings',
        'Orchestrated with LangChain across multiple LLM providers (Mistral AI, Groq, Gemini)',
      ],
    },
    {
      title: 'AI-Powered Code Review Agent',
      icon: <Bot size={24} />,
      technologies: ['Python', 'FastAPI', 'Ollama', 'LLM'],
      description: 'Built an AI code-review agent that uses a locally hosted LLM (Ollama running CodeLlama) to analyze Python code for bugs, security vulnerabilities, performance issues, and best-practice violations.',
      highlights: [
        'Exposed through FastAPI REST API with endpoints for pasted-code and file-based analysis',
        'Returns structured reviews with 0-10 quality score, plus lightweight web UI',
        'Wrote unit tests with pytest and kept all inference on-device for privacy',
      ],
    },
    {
      title: 'House Price Prediction Model',
      icon: <TrendingUp size={24} />,
      technologies: ['Python', 'ZenML', 'MLflow'],
      description: 'Built an end-to-end machine learning pipeline to predict house prices, using ZenML to orchestrate reproducible pipeline stages.',
      highlights: [
        'Tracked experiments, metrics, and model versions with MLflow',
        'Covered data ingestion, preprocessing, feature engineering, and evaluation',
      ],
    },
  ]

  return (
    <section className="section-wrapper projects-section">
      <div className="projects-content">
        <div className="projects-header">
          <h2 className="section-title">
            My <span className="accent-text">Projects</span>
          </h2>
          <p className="projects-intro">
            A collection of my work in Machine Learning, AI, and Full-Stack Development.
          </p>
        </div>

        <div className="projects-grid">
          {projects.map((project, idx) => (
            <div key={idx} className="project-card">
              <div className="project-icon">{project.icon}</div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>

              <ul className="project-highlights">
                {project.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>

              <div className="project-tech">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
