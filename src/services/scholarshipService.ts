import { SCHOLARSHIPS } from '../data/scholarships'
import type { Scholarship } from '../data/scholarships'

/**
 * Thin typed data-access layer over the static scholarship list.
 * Views and App read through this service instead of searching the
 * raw SCHOLARSHIPS array in several places.
 */
export function getAllScholarships(): Scholarship[] {
  return SCHOLARSHIPS
}

export function getScholarshipById(id: string): Scholarship | undefined {
  return SCHOLARSHIPS.find((s) => s.id === id)
}

export function getScholarshipsByState(state: string): Scholarship[] {
  if (state === 'All states' || state === 'All India') return SCHOLARSHIPS
  return SCHOLARSHIPS.filter((s) => s.states.includes('All India') || s.states.includes(state))
}

/** Scholarships sorted by soonest deadline first, limited to `count`. */
export function getUpcomingDeadlines(count = 5): Scholarship[] {
  return [...SCHOLARSHIPS]
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, count)
}
