import { useEffect, useState } from 'react'
import { load, save } from '../lib/storage'

/**
 * useState backed by localStorage, replacing the load-in-initializer
 * plus save-in-useEffect pattern that was repeated three times in App.
 */
export function useLocalStorage<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => load<T>(key, initial))
  useEffect(() => {
    save(key, value)
  }, [key, value])
  return [value, setValue]
}
