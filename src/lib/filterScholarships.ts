import type { Scholarship } from '../data/scholarships'

export interface ScholarshipFilters {
  search: string
  level: string
  category: string
  income: string
  state: string
  sort: string
}

/**
 * Pure filter + sort for the Discover view. Same rules as the v1/v2
 * inline version in App.tsx: text search over name, provider and course;
 * level, category, income limit and state filters; sort by soonest
 * deadline by default, or by highest amount.
 */
export function filterScholarships(list: Scholarship[], filters: ScholarshipFilters): Scholarship[] {
  const query = filters.search.trim().toLowerCase()
  const filtered = list.filter((s) => {
    if (query && !(s.name + ' ' + s.provider + ' ' + s.course).toLowerCase().includes(query)) return false
    if (filters.level !== 'All levels' && s.level !== filters.level) return false
    if (filters.category !== 'All categories' && s.category !== filters.category) return false
    if (filters.income && s.incomeLimit < Number(filters.income)) return false
    if (
      filters.state !== 'All states' &&
      filters.state !== 'All India' &&
      !s.states.includes('All India') &&
      !s.states.includes(filters.state)
    )
      return false
    return true
  })
  if (filters.sort === 'amount') return [...filtered].sort((a, b) => b.amount - a.amount)
  return [...filtered].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
}
