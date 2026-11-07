import { describe, expect, it } from 'vitest'
import { answerAssistant } from './assistant'
import { scoreEligibility } from './eligibility'
import { SCHOLARSHIPS } from '../data/scholarships'
import type { Profile } from '../data/scholarships'

const PROFILE: Profile = { level: 'UG', course: 'B.Tech', income: '2', state: 'Uttar Pradesh', category: 'General', percentage: '80' }
const RESULTS = SCHOLARSHIPS.map((s) => scoreEligibility(PROFILE, s)).sort((a, b) => b.score - a.score)

describe('answerAssistant', () => {
  it('returns the best matches for a profile question', () => {
    const answer = answerAssistant('Which scholarships match my profile best?', PROFILE, RESULTS)
    expect(answer.scholarships.length).toBe(3)
    expect(answer.scholarships[0].id).toBe(RESULTS.filter((r) => r.status === 'Eligible')[0].scholarship.id)
  })

  it('returns the soonest deadlines for a closing question', () => {
    const answer = answerAssistant('What is closing soonest?', PROFILE, RESULTS)
    expect(answer.scholarships[0].id).toBe('pm-scholarship')
    expect(answer.scholarships.length).toBe(3)
  })

  it('returns only Girls category scholarships for a girls question', () => {
    const answer = answerAssistant('Scholarships for girls', PROFILE, RESULTS)
    expect(answer.scholarships.length).toBe(2)
    expect(answer.scholarships.every((s) => s.category === 'Girls')).toBe(true)
  })

  it('returns scholarships with income limit of 8 lakh or more for an income question', () => {
    const answer = answerAssistant('Scholarships with income limit of Rs. 8 lakh or more', PROFILE, RESULTS)
    expect(answer.scholarships.length).toBe(3)
    expect(answer.scholarships.every((s) => s.incomeLimit >= 8)).toBe(true)
  })

  it('returns Merit scholarships for a merit question', () => {
    const answer = answerAssistant('Merit scholarships', PROFILE, RESULTS)
    expect(answer.scholarships.length).toBe(3)
    expect(answer.scholarships.every((s) => s.category === 'Merit')).toBe(true)
  })

  it('returns Need-based scholarships for a need question', () => {
    const answer = answerAssistant('Need-based scholarships', PROFILE, RESULTS)
    expect(answer.scholarships.length).toBe(3)
    expect(answer.scholarships.every((s) => s.category === 'Need-based')).toBe(true)
  })

  it('answers case-insensitively', () => {
    const answer = answerAssistant('WHAT IS CLOSING SOONEST?', PROFILE, RESULTS)
    expect(answer.scholarships[0].id).toBe('pm-scholarship')
  })

  it('gives an honest fallback for an unknown question', () => {
    const answer = answerAssistant('What is the weather today?', PROFILE, RESULTS)
    expect(answer.scholarships.length).toBe(0)
    expect(answer.text).toContain('14 scholarships')
  })

  it('never invents a scholarship', () => {
    const ids = new Set(SCHOLARSHIPS.map((s) => s.id))
    for (const q of ['best matches', 'closing soonest', 'girls', 'income', 'merit', 'need', 'list all']) {
      const answer = answerAssistant(q, PROFILE, RESULTS)
      expect(answer.scholarships.every((s) => ids.has(s.id))).toBe(true)
    }
  })
})
