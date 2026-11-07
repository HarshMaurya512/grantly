import { DOCUMENT_CHECKLIST } from '../data/scholarships'

interface DocumentsViewProps {
  docs: Record<string, boolean>
  onToggle: (name: string, checked: boolean) => void
}

export default function DocumentsView({ docs, onToggle }: DocumentsViewProps) {
  const readyCount = Object.values(docs).filter(Boolean).length
  return (
    <main id="main-content">
      <h1>Documents checklist</h1>
      <p className="intro">Tick what you have ready. This list is saved in this browser.</p>
      <ul className="checklist">
        {DOCUMENT_CHECKLIST.map((d) => (
          <li key={d}><label><input type="checkbox" checked={Boolean(docs[d])} onChange={(e) => onToggle(d, e.target.checked)} /> {d}</label></li>
        ))}
      </ul>
      <p aria-live="polite">{readyCount} of {DOCUMENT_CHECKLIST.length} documents ready.</p>
    </main>
  )
}
