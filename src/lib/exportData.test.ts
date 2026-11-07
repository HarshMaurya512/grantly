import { describe, expect, it } from 'vitest'
import { applicationsToCsv, deadlinesToIcs } from './exportData'
import { SCHOLARSHIPS } from '../data/scholarships'
import type { Application } from '../data/scholarships'

const APPS: Application[] = [
  { id: 'nsp-postmatric', status: 'Applied', updated: '2026-11-07' },
  { id: 'pm-scholarship', status: 'Saved', updated: '2026-11-06' },
]

describe('applicationsToCsv', () => {
  it('writes a header row and one row per application', () => {
    const csv = applicationsToCsv(APPS, SCHOLARSHIPS)
    const lines = csv.trim().split('\n')
    expect(lines[0]).toBe('Scholarship,Provider,Amount,Deadline,Status,Updated')
    expect(lines).toHaveLength(3)
    expect(lines[1]).toContain('NSP Post-Matric Scholarship')
    expect(lines[1]).toContain('Applied')
    expect(lines[2]).toContain('PM Scholarship Scheme')
  })

  it('quotes cells that contain commas', () => {
    const csv = applicationsToCsv([APPS[0]], SCHOLARSHIPS)
    expect(csv).toContain('"National Scholarship Portal, Govt. of India"')
    expect(csv).toContain('"Up to Rs. 12,000 per year"')
  })

  it('returns only the header when there are no applications', () => {
    expect(applicationsToCsv([], [])).toBe('Scholarship,Provider,Amount,Deadline,Status,Updated\n')
  })

  it('skips applications with no matching scholarship', () => {
    const csv = applicationsToCsv([{ id: 'unknown', status: 'Saved', updated: '2026-11-07' }], [])
    expect(csv.trim().split('\n')).toHaveLength(1)
  })
})

describe('deadlinesToIcs', () => {
  const ICS = deadlinesToIcs(APPS, SCHOLARSHIPS)

  it('is a valid minimal calendar with a VEVENT per application', () => {
    expect(ICS).toContain('BEGIN:VCALENDAR')
    expect(ICS).toContain('VERSION:2.0')
    expect(ICS).toContain('END:VCALENDAR')
    expect(ICS.match(/BEGIN:VEVENT/g)).toHaveLength(2)
    expect(ICS.match(/END:VEVENT/g)).toHaveLength(2)
  })

  it('uses each deadline as the event date', () => {
    expect(ICS).toContain('DTSTART;VALUE=DATE:20261231')
    expect(ICS).toContain('DTSTART;VALUE=DATE:20261130')
    expect(ICS).toContain('SUMMARY:Deadline: NSP Post-Matric Scholarship')
  })

  it('escapes commas in the description', () => {
    expect(ICS).toContain('National Scholarship Portal\\, Govt. of India')
  })

  it('skips applications with no matching scholarship', () => {
    const ics = deadlinesToIcs([{ id: 'unknown', status: 'Saved', updated: '2026-11-07' }], [])
    expect(ics).not.toContain('BEGIN:VEVENT')
  })
})
