import type { Scholarship, View } from '../data/scholarships'
import { daysLeft, formatDate } from '../data/scholarships'

interface HomeViewProps {
  total: number
  providerCount: number
  nearest: Scholarship | null
  savedCount: number
  featured: Scholarship[]
  onGo: (view: View) => void
  onSelect: (scholarship: Scholarship) => void
}

const STEPS: { title: string; text: string }[] = [
  { title: '1. Discover', text: 'Search 14 real scholarships and filter by level, category, income and state.' },
  { title: '2. Check eligibility', text: 'Fill your profile once and see a match score and a reason for each scholarship.' },
  { title: '3. Track and apply', text: 'Save scholarships, move applications from Saved to Submitted, and tick off your documents.' },
]

export default function HomeView({ total, providerCount, nearest, savedCount, featured, onGo, onSelect }: HomeViewProps) {
  return (
    <main id="main-content">
      <section className="hero">
        <h1>Find the scholarship that fits you</h1>
        <p className="intro">GRANTLY lists real Indian scholarships, checks your eligibility, and tracks your applications in one place.</p>
        <div className="actions hero-actions">
          <button className="btn primary" type="button" onClick={() => onGo('discover')}>Find scholarships</button>
          <button className="btn" type="button" onClick={() => onGo('eligibility')}>Check my eligibility</button>
        </div>
      </section>
      <section className="stats" aria-label="Scholarships at a glance">
        <div className="stat"><span className="stat-num">{total}</span><span>Scholarships listed</span></div>
        <div className="stat"><span className="stat-num">{providerCount}</span><span>Providers</span></div>
        <div className="stat"><span className="stat-num">{nearest ? `${daysLeft(nearest.deadline)} days` : 'None'}</span><span>{nearest ? `Nearest deadline: ${nearest.name}` : 'Nearest deadline'}</span></div>
        <div className="stat"><span className="stat-num">{savedCount}</span><span>Saved by you</span></div>
      </section>
      <h2>How it works</h2>
      <div className="steps">
        {STEPS.map((s) => (
          <div className="step" key={s.title}>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>
        ))}
      </div>
      <h2>Closing soonest</h2>
      <div className="grid">
        {featured.map((s) => (
          <article className="card" key={s.id}>
            <p className="provider">{s.provider}</p>
            <h3>{s.name}</h3>
            <p className="amount">{s.amountText}</p>
            <p className="deadline">{daysLeft(s.deadline)} days left, deadline {formatDate(s.deadline)}</p>
            <div className="actions">
              <button className="btn primary" type="button" onClick={() => onSelect(s)}>View details</button>
              <button className="btn" type="button" onClick={() => onGo('discover')}>See all scholarships</button>
            </div>
          </article>
        ))}
      </div>
      <p className="meta">Amounts and deadlines are for the 2026-27 cycle. Verify each amount and deadline on the official portal before applying.</p>
    </main>
  )
}
