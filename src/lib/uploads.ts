import type { UploadedFile } from '../data/scholarships'

/** Record a file by name, size and date only. File contents are never read. */
export function addUpload(list: UploadedFile[], file: UploadedFile): UploadedFile[] {
  if (list.some((f) => f.name === file.name && f.size === file.size)) return list
  return [...list, file]
}

export function removeUpload(list: UploadedFile[], name: string, size: number): UploadedFile[] {
  return list.filter((f) => !(f.name === name && f.size === size))
}
