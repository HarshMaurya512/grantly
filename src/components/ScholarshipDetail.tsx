import { useEffect, useRef } from 'react'
import type { Scholarship } from '../data/scholarships'
import { daysLeft, formatDate } from '../data/scholarships'

interface ScholarshipDetailProps {
  scholarship: Scholarship
  saved: boolean
  onClose: () => void
  onTrack: (id: string) => void
  onToggleSave: (id: string) => void
}

export default function ScholarshipDetail({ scholarship, saved, onClose, onTrack, onToggleSave }: ScholarshipDetailProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="detail-heading">
      <div className="modal-box">
        <button className="btn close" type="button" aria-label="Close scholarship details" onClick={onClose}>Close</button>
        <p className="provider">{scholarship.provider}</p>
        <h2 id="detail-heading" ref={headingRef} tabIndex={-1}>{scholarship.name}</h2>
        <p className="amount">{scholarship.amountText}</p>
        <p>{scholarship.description}</p>
        <p className="meta">Official portal: {scholarship.portal}</p>
        <p className="deadline">{daysLeft(scholarship.deadline)} days left, deadline {formatDate(scholarship.deadline)}</p>
        <h3>Benefits</h3><ul>{scholarship.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
        <h3>Documents required</h3><ul>{scholarship.documents.map((d) => <li key={d}>{d}</li>)}</ul>
        <h3>How to apply</h3><ol>{scholarship.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <div className="actions">
          <button className="btn primary" type="button" onClick={() => { onTrack(scholarship.id); onClose() }}>Track this scholarship</button>
          <button className="btn" type="button" aria-pressed={saved} onClick={() => onToggleSave(scholarship.id)}>{saved ? 'Saved' : 'Save'}</button>
        </div>
      </div>
    </div>
  )
}
