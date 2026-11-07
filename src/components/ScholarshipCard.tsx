import type { Scholarship } from '../data/scholarships'
import { daysLeft, formatDate } from '../data/scholarships'

interface ScholarshipCardProps {
  scholarship: Scholarship
  saved: boolean
  compareSelected: boolean
  compareFull: boolean
  onSelect: (scholarship: Scholarship) => void
  onToggleSave: (id: string) => void
  onTrack: (id: string) => void
  onToggleCompare: (id: string) => void
}

export default function ScholarshipCard({ scholarship, saved, compareSelected, compareFull, onSelect, onToggleSave, onTrack, onToggleCompare }: ScholarshipCardProps) {
  const days = daysLeft(scholarship.deadline)
  return (
    <article className="card">
      <p className="provider">{scholarship.provider}</p>
      <h2>{scholarship.name}</h2>
      <p className="amount">{scholarship.amountText}</p>
      <p>{scholarship.description}</p>
      <p className="meta">Level: {scholarship.level} | {scholarship.category} | Open in: {scholarship.states.join(', ')}</p>
      <p className="meta">Income limit: Rs. {scholarship.incomeLimit} lakh | Minimum: {scholarship.minPercentage}%</p>
      <p className={days <= 30 ? 'deadline deadline-urgent' : 'deadline'}>{days} days left, deadline {formatDate(scholarship.deadline)}</p>
      <div className="actions">
        <button className="btn primary" type="button" onClick={() => onSelect(scholarship)}>View details</button>
        <button className="btn" type="button" aria-pressed={saved} onClick={() => onToggleSave(scholarship.id)}>{saved ? 'Saved' : 'Save'}</button>
        <button className="btn" type="button" onClick={() => onTrack(scholarship.id)}>Track</button>
        <button className="btn" type="button" aria-pressed={compareSelected} disabled={!compareSelected && compareFull} onClick={() => onToggleCompare(scholarship.id)}>{compareSelected ? 'Added to compare' : 'Compare'}</button>
      </div>
    </article>
  )
}
