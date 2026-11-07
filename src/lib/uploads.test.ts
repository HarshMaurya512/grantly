import { describe, expect, it } from 'vitest'
import { addUpload, removeUpload } from './uploads'
import type { UploadedFile } from '../data/scholarships'

const FILE: UploadedFile = { name: 'income.pdf', size: 12000, date: '2026-11-07' }

describe('addUpload', () => {
  it('adds a file record', () => {
    expect(addUpload([], FILE)).toEqual([FILE])
  })

  it('does not add the same file twice', () => {
    expect(addUpload([FILE], FILE)).toEqual([FILE])
  })

  it('keeps a different file with the same name', () => {
    const other: UploadedFile = { name: 'income.pdf', size: 9999, date: '2026-11-07' }
    expect(addUpload([FILE], other).length).toBe(2)
  })
})

describe('removeUpload', () => {
  it('removes the matching file and keeps the rest', () => {
    const other: UploadedFile = { name: 'aadhaar.pdf', size: 8000, date: '2026-11-07' }
    expect(removeUpload([FILE, other], 'income.pdf', 12000)).toEqual([other])
  })
})
