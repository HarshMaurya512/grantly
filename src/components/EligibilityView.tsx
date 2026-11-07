import type { EligibilityResult, Profile, Scholarship } from '../data/scholarships'
import { SCHOLARSHIPS } from '../data/scholarships'
import { ALL_STATES_AND_UTS } from '../data/states'

interface EligibilityViewProps {
  profile: Profile
  onProfileChange: (profile: Profile) => void
  results: EligibilityResult[]
  onSelect: (scholarship: Scholarship) => void
  onTrack: (id: string) => void
}

export default function EligibilityView({ profile, onProfileChange, results, onSelect, onTrack }: EligibilityViewProps) {
  return (
    <main id="main-content">
      <h1>Eligibility Check</h1>
      <p className="intro">Fill your profile once. GRANTLY scores all {SCHOLARSHIPS.length} scholarships and tells you why each result matches or does not match.</p>
      <form className="form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="profile-level">Education level<select id="profile-level" value={profile.level} onChange={(e) => onProfileChange({ ...profile, level: e.target.value })}><option>School</option><option>Diploma</option><option>UG</option><option>PG</option></select></label>
        <label htmlFor="profile-course">Course<input id="profile-course" type="text" autoComplete="off" placeholder="For example, B.Tech" value={profile.course} onChange={(e) => onProfileChange({ ...profile, course: e.target.value })} /></label>
        <label htmlFor="profile-income">Annual family income in lakh<input id="profile-income" type="number" min="0" step="0.5" autoComplete="off" placeholder="For example, 2" value={profile.income} onChange={(e) => onProfileChange({ ...profile, income: e.target.value })} /></label>
        <label htmlFor="profile-state">State<select id="profile-state" value={profile.state} onChange={(e) => onProfileChange({ ...profile, state: e.target.value })}>{ALL_STATES_AND_UTS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label htmlFor="profile-category">Category<select id="profile-category" value={profile.category} onChange={(e) => onProfileChange({ ...profile, category: e.target.value })}><option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>Minority</option></select></label>
        <label htmlFor="profile-percentage">Percentage in last exam<input id="profile-percentage" type="number" min="0" max="100" autoComplete="off" placeholder="For example, 78" value={profile.percentage} onChange={(e) => onProfileChange({ ...profile, percentage: e.target.value })} /></label>
      </form>
      <div className="grid">
        {results.map(({ scholarship, score, status, reasons }) => (
          <article className="card" key={scholarship.id}>
            <p className={`badge ${status === 'Eligible' ? 'good' : status === 'Maybe' ? 'warn' : 'bad'}`}>{status} - {score}% match</p>
            <h2>{scholarship.name}</h2>
            <p className="amount">{scholarship.amountText}</p>
            <ul>{reasons.map((r) => <li key={r}>{r}</li>)}</ul>
            <div className="actions">
              <button className="btn primary" type="button" onClick={() => onSelect(scholarship)}>View details</button>
              <button className="btn" type="button" onClick={() => onTrack(scholarship.id)}>Track</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}
