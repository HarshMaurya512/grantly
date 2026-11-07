import type { Scholarship } from '../data/scholarships'
import { daysLeft, formatDate } from '../data/scholarships'

interface ScholarshipCardProps {
  scholarship: Scholarship
  saved: boolean
  onSelect: (scholarship: Scholarship) => void
  onToggleSave: (id: string) => void
  onTrack: (id: string) => void
}

export default function ScholarshipCard({ scholarship, saved, onSelect, onToggleSave, onTrack }: ScholarshipCardProps) {
  return (
    <article className="card">
      <p className="provider">{scholarship.provider}</p>
      <h2>{scholarship.name}</h2>
      <p className="amount">{scholarship.amountText}</p>
      <p>{scholarship.description}</p>
      <p className="meta">Level: {scholarship.level} | {scholarship.category} | Open in: {scholarship.states.join(', ')}</p>
      <p className="meta">Income limit: Rs. {scholarship.incomeLimit} lakh | Minimum: {scholarship.minPercentage}%</p>
      <p className="deadline">{daysLeft(scholarship.deadline)} days left, deadline {formatDate(scholarship.deadline)}</p>
      <div className="actions">
        <button className="btn primary" type="button" onClick={() => onSelect(scholarship)}>View details</button>
        <button className="btn" type="button" aria-pressed={saved} onClick={() => onToggleSave(scholarship.id)}>{saved ? 'Saved' : 'Save'}</button>
        <button className="btn" type="button" onClick={() => onTrack(scholarship.id)}>Track</button>
      </div>
    </article>
  )
}
