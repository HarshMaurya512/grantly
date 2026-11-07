import { describe, expect, it } from 'vitest'
import { getAllScholarships, getScholarshipById, getScholarshipsByState, getUpcomingDeadlines } from './scholarshipService'

describe('scholarshipService', () => {
  it('returns all 14 scholarships', () => {
    expect(getAllScholarships()).toHaveLength(14)
  })

  it('finds a scholarship by id', () => {
    expect(getScholarshipById('up-postmatric')?.name).toBe('UP Scholarship Postmatric')
  })

  it('returns undefined for an unknown id', () => {
    expect(getScholarshipById('does-not-exist')).toBeUndefined()
  })

  it('returns the UP scholarship plus All India scholarships for Uttar Pradesh', () => {
    const list = getScholarshipsByState('Uttar Pradesh')
    expect(list.some((s) => s.id === 'up-postmatric')).toBe(true)
    expect(list).toHaveLength(14)
  })

  it('returns only All India scholarships for a state with no state-specific scheme', () => {
    const list = getScholarshipsByState('Kerala')
    expect(list).toHaveLength(13)
    expect(list.every((s) => s.states.includes('All India'))).toBe(true)
  })

  it('returns upcoming deadlines sorted by soonest deadline first', () => {
    const list = getUpcomingDeadlines(3)
    expect(list).toHaveLength(3)
    expect(list[0].id).toBe('pm-scholarship')
    const times = list.map((s) => new Date(s.deadline).getTime())
    expect(times).toEqual([...times].sort((a, b) => a - b))
  })
})
