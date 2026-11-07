import { useEffect, useMemo, useState } from 'react'

/**
 * Generic debounce factory, tested in useDebounce.test.ts.
 * Each call restarts the timer, so the wrapped function runs once,
 * with the last arguments, after the delay has passed with no new calls.
 */
export function debounce<T extends (...args: never[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: Parameters<T>) => {
    if (timer !== undefined) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/** Returns the value from `delay` ms ago, updating only after typing pauses. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  const update = useMemo(() => debounce((next: T) => setDebounced(next), delay), [delay])

  useEffect(() => {
    update(value)
  }, [value, update])

  return debounced
}
