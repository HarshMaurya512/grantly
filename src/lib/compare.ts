export const MAX_COMPARE = 3

/** Toggle one scholarship id in the compare selection. At most 3 ids. */
export function toggleCompare(selected: string[], id: string): string[] {
  if (selected.includes(id)) return selected.filter((x) => x !== id)
  if (selected.length >= MAX_COMPARE) return selected
  return [...selected, id]
}

export function canCompare(selected: string[]): boolean {
  return selected.length >= 2
}
