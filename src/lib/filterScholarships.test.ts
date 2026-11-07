import { describe, expect, it } from 'vitest'
import type { Scholarship } from '../data/scholarships'
import { SCHOLARSHIPS } from '../data/scholarships'
import { filterScholarships } from './filterScholarships'
import { canCompare, toggleCompare } from './compare'

function baseFilters(overrides: Partial<Parameters<typeof filterScholarships>[1]> = {}) {
  return {
    search: '',
    level: 'All levels',
    category: 'All categories',
    income: '',
    state: 'All states',
    sort: 'deadline',
    ...overrides,
  }
}

describe('filterScholarships', () => {
  it('returns all 14 scholarships with no filters, sorted by soonest deadline', () => {
    const result = filterScholarships(SCHOLARSHIPS, baseFilters())
    expect(result).toHaveLength(14)
    expect(result[0].deadline <= result[result.length - 1].deadline).toBe(true)
  })

  it('sorts by highest amount when sort is amount', () => {
    const result = filterScholarships(SCHOLARSHIPS, baseFilters({ sort: 'amount' }))
    expect(result[0].amount).toBeGreaterThanOrEqual(result[result.length - 1].amount)
    expect(result[0].id).toBe('tata-endowment')
  })

  it('searches name, provider and course case-insensitively', () => {
    expect(filterScholarships(SCHOLARSHIPS, baseFilters({ search: 'nsp' })).map((s) => s.id)).toEqual(
      expect.arrayContaining(['nsp-postmatric', 'nsp-merit-cum-means']),
    )
    expect(filterScholarships(SCHOLARSHIPS, baseFilters({ search: 'ONGC' }))).toHaveLength(1)
  })

  it('filters by level and category', () => {
    const byLevel = filterScholarships(SCHOLARSHIPS, baseFilters({ level: 'PG' }))
    expect(byLevel.length).toBeGreaterThan(0)
    expect(byLevel.every((s) => s.level === 'PG')).toBe(true)
    const byCategory = filterScholarships(SCHOLARSHIPS, baseFilters({ category: 'Girls' }))
    expect(byCategory.every((s) => s.category === 'Girls')).toBe(true)
  })

  it('applies the income filter against the scholarship income limit', () => {
    const result = filterScholarships(SCHOLARSHIPS, baseFilters({ income: '2' }))
    expect(result.every((s) => s.incomeLimit >= 2)).toBe(true)
    expect(result.find((s) => s.id === 'up-postmatric')).toBeDefined()
  })

  it('applies the state filter and keeps All India scholarships', () => {
    const result = filterScholarships(SCHOLARSHIPS, baseFilters({ state: 'Uttar Pradesh' }))
    expect(result.find((s) => s.id === 'up-postmatric')).toBeDefined()
    expect(result.find((s) => s.id === 'nsp-postmatric')).toBeDefined()
    const karnataka = filterScholarships(SCHOLARSHIPS, baseFilters({ state: 'Karnataka' }))
    expect(karnataka.find((s) => s.id === 'up-postmatric')).toBeUndefined()
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterScholarships(SCHOLARSHIPS, baseFilters({ search: 'zzzz-no-such-scholarship' }))).toHaveLength(0)
  })

  it('does not mutate the input list', () => {
    const input: Scholarship[] = [...SCHOLARSHIPS]
    filterScholarships(input, baseFilters({ sort: 'amount' }))
    expect(input[0].id).toBe(SCHOLARSHIPS[0].id)
  })
})

describe('toggleCompare', () => {
  it('adds an id, removes it on a second toggle, and caps selection at 3', () => {
    expect(toggleCompare([], 'a')).toEqual(['a'])
    expect(toggleCompare(['a', 'b'], 'a')).toEqual(['b'])
    expect(toggleCompare(['a', 'b', 'c'], 'd')).toEqual(['a', 'b', 'c'])
    expect(toggleCompare(['a', 'b', 'c'], 'c')).toEqual(['a', 'b'])
  })

  it('requires at least 2 selections before a comparison is useful', () => {
    expect(canCompare([])).toBe(false)
    expect(canCompare(['a'])).toBe(false)
    expect(canCompare(['a', 'b'])).toBe(true)
    expect(canCompare(['a', 'b', 'c'])).toBe(true)
  })
})
