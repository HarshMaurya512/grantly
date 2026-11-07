import type { Scholarship } from '../data/scholarships'
import { SCHOLARSHIPS } from '../data/scholarships'
import { ALL_STATES_AND_UTS, INCOME_OPTIONS } from '../data/states'
import ScholarshipCard from './ScholarshipCard'

interface DiscoverViewProps {
  search: string
  onSearchChange: (value: string) => void
  level: string
  onLevelChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  income: string
  onIncomeChange: (value: string) => void
  state: string
  onStateChange: (value: string) => void
  sort: string
  onSortChange: (value: string) => void
  filtered: Scholarship[]
  levels: string[]
  categories: string[]
  saved: string[]
  compareIds: string[]
  onSelect: (scholarship: Scholarship) => void
  onToggleSave: (id: string) => void
  onTrack: (id: string) => void
  onToggleCompare: (id: string) => void
}

export default function DiscoverView(props: DiscoverViewProps) {
  const { search, onSearchChange, level, onLevelChange, category, onCategoryChange, income, onIncomeChange, state, onStateChange, sort, onSortChange, filtered, levels, categories, saved, compareIds, onSelect, onToggleSave, onTrack, onToggleCompare } = props
  return (
    <main id="main-content">
      <h1>Discover scholarships</h1>
      <p className="intro">Search by name, provider or course. Use the income filter to see scholarships whose income limit is at or above the value you select.</p>
      <div className="filters">
        <label htmlFor="search-scholarships">Search scholarships<input id="search-scholarships" type="search" autoComplete="off" autoCorrect="off" inputMode="search" placeholder="Search by name, provider, course..." value={search} onChange={(e) => onSearchChange(e.target.value)} /></label>
        <label htmlFor="filter-level">Level<select id="filter-level" value={level} onChange={(e) => onLevelChange(e.target.value)}>{levels.map((l) => <option key={l}>{l}</option>)}</select></label>
        <label htmlFor="filter-category">Category<select id="filter-category" value={category} onChange={(e) => onCategoryChange(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label htmlFor="filter-income">Family income up to<select id="filter-income" value={income} onChange={(e) => onIncomeChange(e.target.value)}>{INCOME_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}</select></label>
        <label htmlFor="filter-state">State<select id="filter-state" value={state} onChange={(e) => onStateChange(e.target.value)}><option>All states</option><option>All India</option>{ALL_STATES_AND_UTS.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label htmlFor="filter-sort">Sort<select id="filter-sort" value={sort} onChange={(e) => onSortChange(e.target.value)}><option value="deadline">Deadline: soonest first</option><option value="amount">Amount: highest first</option></select></label>
      </div>
      <p className="count" aria-live="polite">Showing {filtered.length} of {SCHOLARSHIPS.length} scholarships</p>
      <div className="grid">
        {filtered.map((s) => (
          <ScholarshipCard key={s.id} scholarship={s} saved={saved.includes(s.id)} compareSelected={compareIds.includes(s.id)} compareFull={compareIds.length >= 3} onSelect={onSelect} onToggleSave={onToggleSave} onTrack={onTrack} onToggleCompare={onToggleCompare} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="empty-state" role="status">
          <h2>No scholarships match these filters</h2>
          <p>Clear the search or choose a wider income or state to see more scholarships.</p>
        </div>
      )}
    </main>
  )
}
