import StudyWorkflowFigure from './anatomy/study-workflow/figure'
import './StudyPipeline3D.css'

export default function StudyPipeline3D() {
  return (
    <section className="study-pipeline" aria-labelledby="study-pipeline-title">
      <div className="study-pipeline__heading">
        <span className="case-eyebrow"><span aria-hidden="true" /> Inside the study workflow</span>
        <h2 id="study-pipeline-title">Material in.<br />Understanding out.</h2>
        <p>Follow one study session from source material to a grounded review.</p>
      </div>
      <div className="study-pipeline__content">
        <StudyWorkflowFigure />
      </div>
    </section>
  )
}
