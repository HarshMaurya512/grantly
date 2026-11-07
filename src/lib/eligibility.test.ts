import { describe, expect, it } from 'vitest'
import type { Profile, Scholarship } from '../data/scholarships'
import { SCHOLARSHIPS } from '../data/scholarships'
import { scoreEligibility } from './eligibility'
import { sanitizeSearch } from './sanitize'

function baseScholarship(overrides: Partial<Scholarship> = {}): Scholarship {
  return {
    id: 'test',
    name: 'Test Scholarship',
    provider: 'Test Provider',
    portal: 'example.in',
    amount: 10000,
    amountText: 'Rs. 10,000 per year',
    deadline: '2026-12-31',
    level: 'UG',
    category: 'Merit',
    incomeLimit: 2.5,
    minPercentage: 60,
    states: ['All India'],
    course: 'All courses',
    description: 'Test scholarship.',
    benefits: ['Fee support'],
    documents: ['Aadhaar card'],
    steps: ['Apply online'],
    ...overrides,
  }
}

function baseProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    level: 'UG',
    course: 'B.Tech',
    income: '2',
    state: 'Uttar Pradesh',
    category: 'General',
    percentage: '80',
    ...overrides,
  }
}

describe('scoreEligibility', () => {
  it('returns Eligible with 100 when every check passes', () => {
    const result = scoreEligibility(baseProfile(), baseScholarship())
    expect(result.status).toBe('Eligible')
    expect(result.score).toBe(100)
    expect(result.reasons).toHaveLength(4)
  })

  it('returns Maybe when exactly two checks pass', () => {
    const result = scoreEligibility(baseProfile({ income: '5', percentage: '40' }), baseScholarship())
    expect(result.score).toBe(50)
    expect(result.status).toBe('Maybe')
  })

  it('returns Not eligible when most checks fail', () => {
    const result = scoreEligibility(
      baseProfile({ level: 'PG', income: '10', state: 'Karnataka', percentage: '40' }),
      baseScholarship({ level: 'UG', states: ['Uttar Pradesh'] }),
    )
    expect(result.score).toBeLessThan(50)
    expect(result.status).toBe('Not eligible')
  })

  it('applies the income limit', () => {
    const over = scoreEligibility(baseProfile({ income: '3' }), baseScholarship({ incomeLimit: 2.5 }))
    expect(over.reasons.join(' ')).toContain('Income limit is Rs. 2.5 lakh')
    const within = scoreEligibility(baseProfile({ income: '2.5' }), baseScholarship({ incomeLimit: 2.5 }))
    expect(within.score).toBe(100)
  })

  it('applies state scope, including All India scholarships', () => {
    const allIndia = scoreEligibility(baseProfile({ state: 'Karnataka' }), baseScholarship())
    expect(allIndia.score).toBe(100)
    const stateOnly = scoreEligibility(baseProfile({ state: 'Karnataka' }), baseScholarship({ states: ['Uttar Pradesh'] }))
    expect(stateOnly.score).toBe(75)
    expect(stateOnly.status).toBe('Eligible')
    const stateMatch = scoreEligibility(baseProfile({ state: 'Uttar Pradesh' }), baseScholarship({ states: ['Uttar Pradesh'] }))
    expect(stateMatch.score).toBe(100)
  })

  it('applies the minimum percentage', () => {
    const below = scoreEligibility(baseProfile({ percentage: '59' }), baseScholarship({ minPercentage: 60 }))
    expect(below.score).toBe(75)
    const atLimit = scoreEligibility(baseProfile({ percentage: '60' }), baseScholarship({ minPercentage: 60 }))
    expect(atLimit.score).toBe(100)
  })

  it('scores the real UP scholarship as Eligible for a matching UP profile', () => {
    const up = SCHOLARSHIPS.find((s) => s.id === 'up-postmatric')
    expect(up).toBeDefined()
    if (!up) return
    const result = scoreEligibility(baseProfile({ income: '2', percentage: '60' }), up)
    expect(result.status).toBe('Eligible')
  })
})

describe('sanitizeSearch', () => {
  it('trims, limits to 100 characters, and strips angle brackets and quotes', () => {
    expect(sanitizeSearch('  NSP <script>  ')).toBe('NSP script')
    expect(sanitizeSearch(`a"b'c\`d`)).toBe('abcd')
    expect(sanitizeSearch('x'.repeat(150))).toHaveLength(100)
  })
})
