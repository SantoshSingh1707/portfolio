import { Plate } from '../kit/react/draw'
import { CARRIAGE, FEEDER, FRAME, INDEX, MODEL_AND_OUTPUT, BASE } from './art'
import { phaseText, STAGES, INITIAL_STAGE } from './model'
import { StudyWorkflowLive } from './live'
import '../kit/iso.css'
import './figure.css'

const LABEL = 'A local study bench: course files pass through scanning and indexing, a retrieval carriage selects source context, and a local model places study outputs on the tray.'

export default function StudyWorkflowFigure() {
  return (
    <div className="iso study-workflow-figure" data-theme="dark">
      <Plate
        fig="Fig 01"
        title="Study workflow / RAG"
        hint="Select a stage · ← →"
        readout={phaseText(INITIAL_STAGE, false)}
        keys={[
          { mark: 'lit', label: 'Moving retrieval carriage' },
          { mark: 'raised', label: 'Study workflow mechanisms' },
          { mark: 'dim', label: 'Source and output records' },
        ]}
        caption={`Course files enter the scanner and are organized for retrieval. ${STAGES[1].text} Retrieved context then reaches a local Mistral model through LangChain and Ollama, producing source-grounded quizzes and notes.`}
      >
        <StudyWorkflowLive
          base={BASE}
          feeder={FEEDER}
          index={INDEX}
          model={MODEL_AND_OUTPUT}
          frame={FRAME}
          carriage={CARRIAGE}
        />
      </Plate>
      <span className="study-workflow-figure__sr-only">{LABEL}</span>
    </div>
  )
}
