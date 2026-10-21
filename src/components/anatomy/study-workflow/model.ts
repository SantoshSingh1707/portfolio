export const STAGES = [
  {
    label: 'Add material',
    short: 'Source files',
    readout: 'SOURCE FILES · ready to ingest',
    text: 'PDF, TXT, DOCX, and PPTX material enters the study workflow.',
  },
  {
    label: 'Retrieve context',
    short: 'Relevant passages',
    readout: 'RETRIEVAL · selecting source context',
    text: 'Sentence Transformer embeddings and ChromaDB support retrieval from the uploaded material.',
  },
  {
    label: 'Review outputs',
    short: 'Quiz + notes',
    readout: 'LOCAL MODEL · grounded study output',
    text: 'LangChain connects retrieved context to a local Mistral model through Ollama for source-grounded quizzes and notes.',
  },
] as const

export const STAGE_X = [-116, -14, 84] as const
export const INITIAL_STAGE = 0

export function phaseText(index: number, moving: boolean) {
  const stage = STAGES[index] ?? STAGES[INITIAL_STAGE]
  return moving ? `MOVING · ${stage.short.toUpperCase()}` : stage.readout
}
