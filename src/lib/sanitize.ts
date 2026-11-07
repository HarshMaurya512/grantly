export function sanitizeSearch(value: string): string {
  return value
    .trim()
    .slice(0, 100)
    .replace(/[<>"'`]/g, '')
}

export function sanitizeText(value: string): string {
  return value.trim().slice(0, 100).replace(/[<>"'`]/g, '')
}
