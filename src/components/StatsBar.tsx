import type { Scholarship } from '../data/scholarships'
import { daysLeft } from '../data/scholarships'

interface StatsBarProps {
  savedCount: number
  inProgressCount: number
  nearest: Scholarship | null
  total: number
}

export default function StatsBar({ savedCount, inProgressCount, nearest, total }: StatsBarProps) {
  return (
    <section className="stats" aria-label="Your progress">
      <div className="stat"><span className="stat-num">{savedCount}</span><span>Saved scholarships</span></div>
      <div className="stat"><span className="stat-num">{inProgressCount}</span><span>Applications in progress</span></div>
      <div className="stat"><span className="stat-num">{nearest ? `${daysLeft(nearest.deadline)} days` : 'None'}</span><span>{nearest ? `Nearest deadline: ${nearest.name}` : 'Nearest deadline'}</span></div>
      <div className="stat"><span className="stat-num">{total}</span><span>Scholarships listed</span></div>
    </section>
  )
}
