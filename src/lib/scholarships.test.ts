import { describe, expect, it } from 'vitest'
import { DOCUMENT_CHECKLIST, SCHOLARSHIPS, daysLeft, formatDate } from '../data/scholarships'

describe('scholarship data', () => {
  it('has exactly 14 scholarships', () => {
    expect(SCHOLARSHIPS).toHaveLength(14)
  })

  it('has unique ids', () => {
    const ids = SCHOLARSHIPS.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has positive amounts and a name, provider, and portal for every scholarship', () => {
    for (const s of SCHOLARSHIPS) {
      expect(s.amount).toBeGreaterThan(0)
      expect(s.name.length).toBeGreaterThan(0)
      expect(s.provider.length).toBeGreaterThan(0)
      expect(s.portal.length).toBeGreaterThan(0)
      expect(s.amountText.length).toBeGreaterThan(0)
    }
  })

  it('has valid deadlines in YYYY-MM-DD form', () => {
    for (const s of SCHOLARSHIPS) {
      expect(s.deadline).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(new Date(`${s.deadline}T00:00:00`).getTime())).toBe(false)
    }
  })

  it('has positive income limits and percentages between 0 and 100', () => {
    for (const s of SCHOLARSHIPS) {
      expect(s.incomeLimit).toBeGreaterThan(0)
      expect(s.minPercentage).toBeGreaterThan(0)
      expect(s.minPercentage).toBeLessThanOrEqual(100)
      expect(s.states.length).toBeGreaterThan(0)
    }
  })

  it('has a 12-item document checklist', () => {
    expect(DOCUMENT_CHECKLIST).toHaveLength(12)
  })
})

describe('daysLeft and formatDate', () => {
  it('returns a number for daysLeft', () => {
    const value = daysLeft('2026-12-31')
    expect(typeof value).toBe('number')
    expect(Number.isInteger(value)).toBe(true)
  })

  it('returns a later count for a later deadline', () => {
    expect(daysLeft('2027-03-07')).toBeGreaterThan(daysLeft('2026-11-30'))
  })

  it('formats a date in en-IN style', () => {
    expect(formatDate('2026-12-31')).toContain('2026')
    expect(formatDate('2026-12-31')).toContain('Dec')
  })
})
