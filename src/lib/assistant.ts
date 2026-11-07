import type { EligibilityResult, Profile, Scholarship } from '../data/scholarships'
import { daysLeft, formatDate, SCHOLARSHIPS } from '../data/scholarships'

export interface AssistantAnswer {
  title: string
  text: string
  scholarships: Scholarship[]
}

export const ASSISTANT_SUGGESTIONS: string[] = [
  'Which scholarships match my profile best?',
  'What is closing soonest?',
  'Scholarships for girls',
  'Scholarships with income limit of Rs. 8 lakh or more',
]

function byDeadline(a: Scholarship, b: Scholarship): number {
  return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
}

function byAmountDesc(a: Scholarship, b: Scholarship): number {
  return b.amount - a.amount
}

/**
 * Rule-based assistant. It only reads the 14 scholarships in this app
 * and the eligibility results already computed from the profile.
 * It calls no API and invents no scholarships.
 */
export function answerAssistant(question: string, profile: Profile, results: EligibilityResult[]): AssistantAnswer {
  const q = question.trim().toLowerCase()
  const levelText = profile.level ? ` for ${profile.level} level` : ''

  if (q.includes('best') || q.includes('match') || q.includes('profile') || q.includes('eligible')) {
    const eligible = results.filter((r) => r.status === 'Eligible')
    const picked = (eligible.length > 0 ? eligible : results).slice(0, 3)
    return {
      title: 'Best matches for your profile',
      text: `Scored from your eligibility check${levelText}. These are your highest matches from the 14 scholarships in this app.`,
      scholarships: picked.map((r) => r.scholarship),
    }
  }

  if (q.includes('closing') || q.includes('soonest') || q.includes('deadline') || q.includes('urgent') || q.includes('expir')) {
    const picked = [...SCHOLARSHIPS].sort(byDeadline).slice(0, 3)
    return {
      title: 'Closing soonest',
      text: `The soonest deadline is ${picked[0].name} on ${formatDate(picked[0].deadline)}, ${daysLeft(picked[0].deadline)} days left. Check the official portal before applying.`,
      scholarships: picked,
    }
  }

  if (q.includes('girl') || q.includes('women') || q.includes('woman')) {
    const picked = SCHOLARSHIPS.filter((s) => s.category === 'Girls').sort(byDeadline)
    return {
      title: 'Scholarships for girls',
      text: `There are ${picked.length} scholarships in the Girls category in this app.`,
      scholarships: picked,
    }
  }

  if (q.includes('merit')) {
    const picked = SCHOLARSHIPS.filter((s) => s.category === 'Merit').sort(byAmountDesc).slice(0, 3)
    return {
      title: 'Merit scholarships',
      text: 'The 3 highest-value Merit scholarships in this app, by amount.',
      scholarships: picked,
    }
  }

  if (q.includes('need')) {
    const picked = SCHOLARSHIPS.filter((s) => s.category === 'Need-based').sort(byDeadline).slice(0, 3)
    return {
      title: 'Need-based scholarships',
      text: 'The 3 soonest-closing Need-based scholarships in this app.',
      scholarships: picked,
    }
  }

  if (q.includes('income')) {
    const picked = SCHOLARSHIPS.filter((s) => s.incomeLimit >= 8).sort(byAmountDesc).slice(0, 3)
    return {
      title: 'Scholarships with income limit of Rs. 8 lakh or more',
      text: `There are ${SCHOLARSHIPS.filter((s) => s.incomeLimit >= 8).length} scholarships with an income limit of Rs. 8 lakh or more. These are the 3 highest-value ones.`,
      scholarships: picked,
    }
  }

  if (q.includes('list') || q.includes('all') || q.includes('show')) {
    const picked = [...SCHOLARSHIPS].sort(byDeadline).slice(0, 3)
    return {
      title: 'Scholarships in this app',
      text: `This app lists ${SCHOLARSHIPS.length} scholarships. Here are the 3 closing soonest. Use Discover to see all of them.`,
      scholarships: picked,
    }
  }

  return {
    title: 'I can answer from these 14 scholarships',
    text: 'I can only answer from the 14 scholarships in this app. Ask about your best matches, what is closing soonest, scholarships for girls, Merit or Need-based scholarships, or scholarships with an income limit of Rs. 8 lakh or more.',
    scholarships: [],
  }
}
