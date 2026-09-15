import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react'
import './Home.css'

const details = {
  'ai-study-tool': {
    index: '01', type: 'RAG / PRODUCT', title: 'AI STUDY TOOL', category: 'RAG', tone: 'project-lime', github: 'https://github.com/SantoshSingh1707/AI-Study-Tool', summary: 'A full-stack learning companion that turns personal course material into active revision.', problem: 'Long PDFs, DOCX files, and slide decks are difficult to convert into useful study sessions quickly.', approach: 'Built a document ingestion and retrieval pipeline with Sentence-Transformer embeddings, ChromaDB, and LangChain across Mistral AI, Groq, and Gemini.', outcome: 'A single workflow for grounded quizzes, flashcards, and study notes generated from the learner’s own files.', stack: 'PYTHON · FASTAPI · REACT · LANGCHAIN · CHROMADB',
  },
  'code-review-agent': {
    index: '02', type: 'LOCAL AI / AGENT', title: 'CODE REVIEW AGENT', category: 'Agents', tone: 'project-orange', github: 'https://github.com/SantoshSingh1707/code-review-agent', summary: 'A privacy-first local agent for practical Python code feedback.', problem: 'Developers need early feedback on bugs and security issues without sending source code to a hosted model.', approach: 'Wrapped Ollama and CodeLlama in a FastAPI service with pasted-code and file-based analysis, structured findings, and a 0–10 quality score.', outcome: 'Private, testable code review with pytest coverage for the core agent logic.', stack: 'PYTHON · FASTAPI · OLLAMA · CODELLAMA · PYTEST',
  },
  'house-price-model': {
    index: '03', type: 'MLOPS / PIPELINE', title: 'HOUSE PRICE MODEL', category: 'MLOps', tone: 'project-blue', github: 'https://github.com/SantoshSingh1707/House-price-prediction-end-to-end-project', summary: 'A reproducible machine-learning pipeline with traceable experiments.', problem: 'A model is difficult to trust when data preparation and experiments cannot be reproduced.', approach: 'Used ZenML to orchestrate ingestion, preprocessing, feature engineering, and evaluation while MLflow tracked metrics and model versions.', outcome: 'An end-to-end workflow ready for repeatable experimentation and review.', stack: 'PYTHON · ZENML · MLFLOW · SCIKIT-LEARN',
  },
  'truthlens-ai': {
    index: '04', type: 'COMPUTER VISION', title: 'TRUTHLENS AI', category: 'Computer Vision', tone: 'project-red', github: 'https://github.com/SantoshSingh1707/AI-Image-Detection', summary: 'An explainable image-analysis direction for synthetic and manipulated media.', problem: 'Visual inspection alone cannot explain where generated or manipulated image artifacts come from.', approach: 'Explored CNN and transfer-learning models alongside frequency-domain analysis, metadata forensics, and Grad-CAM explanations.', outcome: 'A research direction that pairs image classification with interpretable evidence.', stack: 'TENSORFLOW · EFFICIENTNET · VIT · FFT · OPENCV',
  },
}

function ProjectDetail() {
  const slug = window.location.pathname.split('/').filter(Boolean).pop()
  const project = details[slug]

  if (!project) {
    return <main className="stitch-home project-not-found"><p className="stitch-kicker">404 / PROJECT NOT FOUND</p><h1>That case study<br /><i>does not exist.</i></h1><a className="text-link" href="/">BACK TO PORTFOLIO <ArrowLeft size={15} /></a></main>
  }

  return (
    <main className="stitch-home project-detail-page">
      <header className="stitch-header"><a className="stitch-logo" href="/">SS<span>/</span>26</a><p>PROJECT ARCHIVE<br />CASE STUDY / {project.index}</p><span className="header-avatar" aria-hidden="true">S</span><a className="stitch-menu-button back-button" href="/" aria-label="Back to portfolio"><ArrowLeft size={21} /></a></header>
      <section className={`project-detail-hero ${project.tone}`}><div className="section-number">{project.index} / {project.category}</div><p className="stitch-kicker">{project.type}</p><h1>{project.title}</h1><p className="detail-summary">{project.summary}</p><div className="detail-meta"><span>{project.stack}</span><a href={project.github} target="_blank" rel="noreferrer">OPEN GITHUB <ExternalLink size={14} /></a></div></section>
      <section className="detail-grid"><article><span>01 / PROBLEM</span><h2>{project.problem}</h2></article><article><span>02 / APPROACH</span><h2>{project.approach}</h2></article><article><span>03 / OUTCOME</span><h2>{project.outcome}</h2></article></section>
      <section className="detail-footer"><a className="text-link" href="/projects/ai-study-tool"><ArrowLeft size={15} /> FIRST PROJECT</a><a className="text-link" href="/">ALL WORK <ArrowUpRight size={15} /></a></section>
    </main>
  )
}

export default ProjectDetail
