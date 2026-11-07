import { DOCUMENT_CHECKLIST } from '../data/scholarships'
import type { UploadedFile } from '../data/scholarships'

interface DocumentsViewProps {
  docs: Record<string, boolean>
  onToggle: (name: string, checked: boolean) => void
  uploads: UploadedFile[]
  onAddUpload: (file: UploadedFile) => void
  onRemoveUpload: (name: string, size: number) => void
}

export default function DocumentsView({ docs, onToggle, uploads, onAddUpload, onRemoveUpload }: DocumentsViewProps) {
  const readyCount = Object.values(docs).filter(Boolean).length

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    onAddUpload({ name: file.name, size: file.size, date: new Date().toISOString().slice(0, 10) })
    e.target.value = ''
  }

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
      <h2>Your files</h2>
      <p className="intro">Add a file to record it here. Files are recorded in this browser only. No file is uploaded to a server.</p>
      <label htmlFor="upload-file">Choose a file<input id="upload-file" type="file" onChange={handleFileChange} /></label>
      {uploads.length === 0 ? (
        <p className="meta">No files recorded yet.</p>
      ) : (
        <ul className="checklist upload-list">
          {uploads.map((f) => (
            <li key={`${f.name}-${f.size}`}>
              <span>{f.name} - {Math.max(1, Math.round(f.size / 1024))} KB - {f.date}</span>
              <button className="btn" type="button" onClick={() => onRemoveUpload(f.name, f.size)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
