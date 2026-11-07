import { useEffect, useMemo, useState } from 'react'
import type { Application, ApplicationStatus, Profile, Scholarship, View } from './data/scholarships'
import { SCHOLARSHIPS } from './data/scholarships'
import { scoreEligibility } from './lib/eligibility'
import { load, save } from './lib/storage'
import { sanitizeSearch } from './lib/sanitize'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import DiscoverView from './components/DiscoverView'
import EligibilityView from './components/EligibilityView'
import TrackerView from './components/TrackerView'
import DocumentsView from './components/DocumentsView'
import ScholarshipDetail from './components/ScholarshipDetail'

export default function App() {
  const [view, setView] = useState<View>('discover')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All levels')
  const [category, setCategory] = useState('All categories')
  const [income, setIncome] = useState('')
  const [state, setState] = useState('All states')
  const [sort, setSort] = useState('deadline')
  const [selected, setSelected] = useState<Scholarship | null>(null)
  const [saved, setSaved] = useState<string[]>(() => load<string[]>('grantly-saved', []))
  const [applications, setApplications] = useState<Application[]>(() => load<Application[]>('grantly-applications', []))
  const [docs, setDocs] = useState<Record<string, boolean>>(() => load<Record<string, boolean>>('grantly-docs', {}))
  const [profile, setProfile] = useState<Profile>({
    level: 'UG',
    course: '',
    income: '',
    state: 'Uttar Pradesh',
    category: 'General',
    percentage: '',
  })

  useEffect(() => save('grantly-saved', saved), [saved])
  useEffect(() => save('grantly-applications', applications), [applications])
  useEffect(() => save('grantly-docs', docs), [docs])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    const list = SCHOLARSHIPS.filter((s) => {
      if (query && !(s.name + ' ' + s.provider + ' ' + s.course).toLowerCase().includes(query)) return false
      if (level !== 'All levels' && s.level !== level) return false
      if (category !== 'All categories' && s.category !== category) return false
      if (income && s.incomeLimit < Number(income)) return false
      if (state !== 'All states' && state !== 'All India' && !s.states.includes('All India') && !s.states.includes(state)) return false
      return true
    })
    if (sort === 'amount') return [...list].sort((a, b) => b.amount - a.amount)
    return [...list].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  }, [search, level, category, income, state, sort])

  const eligibilityResults = useMemo(
    () => SCHOLARSHIPS.map((s) => scoreEligibility(profile, s)).sort((a, b) => b.score - a.score),
    [profile],
  )

  const nearest = useMemo(() => {
    const upcoming = applications
      .map((a) => SCHOLARSHIPS.find((s) => s.id === a.id))
      .filter((s): s is Scholarship => Boolean(s))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    return upcoming[0] ?? null
  }, [applications])

  function toggleSave(id: string) {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function addToTracker(id: string) {
    if (!applications.find((a) => a.id === id)) {
      setApplications((prev) => [...prev, { id, status: 'Saved', updated: new Date().toISOString().slice(0, 10) }])
    }
    if (!saved.includes(id)) setSaved((prev) => [...prev, id])
    setView('tracker')
  }

  function setStatus(id: string, status: ApplicationStatus) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status, updated: new Date().toISOString().slice(0, 10) } : a)))
  }

  function removeApplication(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  const levels = ['All levels', ...new Set(SCHOLARSHIPS.map((s) => s.level))]
  const categories = ['All categories', ...new Set(SCHOLARSHIPS.map((s) => s.category))]

  return (
    <div className="page">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header view={view} onViewChange={setView} />
      <StatsBar savedCount={saved.length} inProgressCount={applications.filter((a) => a.status !== 'Submitted').length} nearest={nearest} total={SCHOLARSHIPS.length} />
      {view === 'discover' && (
        <DiscoverView
          search={search}
          onSearchChange={(value) => setSearch(sanitizeSearch(value))}
          level={level}
          onLevelChange={setLevel}
          category={category}
          onCategoryChange={setCategory}
          income={income}
          onIncomeChange={setIncome}
          state={state}
          onStateChange={setState}
          sort={sort}
          onSortChange={setSort}
          filtered={filtered}
          levels={levels}
          categories={categories}
          saved={saved}
          onSelect={setSelected}
          onToggleSave={toggleSave}
          onTrack={addToTracker}
        />
      )}
      {view === 'eligibility' && (
        <EligibilityView profile={profile} onProfileChange={setProfile} results={eligibilityResults} onSelect={setSelected} onTrack={addToTracker} />
      )}
      {view === 'tracker' && (
        <TrackerView applications={applications} onStatusChange={setStatus} onRemove={removeApplication} onSelect={setSelected} />
      )}
      {view === 'documents' && (
        <DocumentsView docs={docs} onToggle={(name, checked) => setDocs({ ...docs, [name]: checked })} />
      )}
      {selected && (
        <ScholarshipDetail scholarship={selected} saved={saved.includes(selected.id)} onClose={() => setSelected(null)} onTrack={addToTracker} onToggleSave={toggleSave} />
      )}
      <footer>
        <p>GRANTLY is a student project for THE OUTPOST, Frontend Arena. Scholarship data is for the 2026-27 cycle. Verify amounts and deadlines on the official portal before applying.</p>
        <p className="copyright">© 2026 GRANTLY. All rights reserved. Built by Harsh Maurya for THE OUTPOST, Frontend Arena.</p>
      </footer>
    </div>
  )
}
