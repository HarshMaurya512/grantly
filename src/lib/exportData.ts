import type { Application, Scholarship } from '../data/scholarships'

function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

/** Applications as a CSV file. Commas and quotes in names and providers are escaped. */
export function applicationsToCsv(applications: Application[], scholarships: Scholarship[]): string {
  const header = 'Scholarship,Provider,Amount,Deadline,Status,Updated'
  const rows: string[] = []
  for (const app of applications) {
    const s = scholarships.find((x) => x.id === app.id)
    if (!s) continue
    const cells = [s.name, s.provider, s.amountText, s.deadline, app.status, app.updated]
    rows.push(cells.map(escapeCsvCell).join(','))
  }
  return [header, ...rows].join('\n') + '\n'
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function dateToIcsDate(dateString: string): string {
  return dateString.replace(/-/g, '')
}

function nowIcsTimestamp(): string {
  return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/** One VEVENT per tracked application, on its deadline date. Minimal valid iCalendar. */
export function deadlinesToIcs(applications: Application[], scholarships: Scholarship[]): string {
  const lines: string[] = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//GRANTLY//Scholarship Deadlines//EN']
  for (const app of applications) {
    const s = scholarships.find((x) => x.id === app.id)
    if (!s) continue
    lines.push(
      'BEGIN:VEVENT',
      `UID:${s.id}@grantly`,
      `DTSTAMP:${nowIcsTimestamp()}`,
      `DTSTART;VALUE=DATE:${dateToIcsDate(s.deadline)}`,
      `SUMMARY:${escapeIcsText(`Deadline: ${s.name}`)}`,
      `DESCRIPTION:${escapeIcsText(`${s.provider} - ${s.amountText} - status ${app.status}`)}`,
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n') + '\r\n'
}

/** Triggers a client-side file download. Nothing is sent to a server. */
export function downloadTextFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
