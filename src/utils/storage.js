import { STORAGE_KEY } from '../data/constants.js'
import { defaultClubState } from '../data/defaults.js'
import { validateClubExport } from './validate.js'

export function loadClubState() {
  const fallback = defaultClubState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    const result = validateClubExport(parsed)
    return result.ok ? result.value : fallback
  } catch {
    return fallback
  }
}

export function saveClubState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return { ok: true }
  } catch {
    return {
      ok: false,
      error:
        'This browser could not save the latest edit. Storage may be full. Use a project file path for photos and videos instead of uploading large files.',
    }
  }
}

export function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
