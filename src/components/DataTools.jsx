import { useState } from 'react'
import { useClubData } from '../hooks/useClubData.js'
import { downloadJson } from '../utils/storage.js'
import { validateClubExport } from '../utils/validate.js'
import { ghostButton, primaryButton } from '../utils/ui.js'
import ConfirmationModal from './ConfirmationModal.jsx'

export default function DataTools() {
  const club = useClubData()
  const [errors, setErrors] = useState([])
  const [pending, setPending] = useState(null)
  const [notice, setNotice] = useState('')

  function exportData() {
    downloadJson('chaka-to-chaka-data.json', {
      version: club.version,
      settings: club.settings,
      players: club.players,
      matches: club.matches,
      gallery: club.gallery,
      requests: club.requests,
    })
  }

  function onImport(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || ''))
        const result = validateClubExport(parsed)
        if (!result.ok) {
          setErrors(result.errors)
          setNotice('')
          return
        }
        setErrors([])
        setPending(result.value)
      } catch {
        setErrors(['That file is not valid JSON.'])
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-6 text-muted">
        Players, matches, gallery details, and settings are stored in this browser’s localStorage. They do not sync to other people or devices. Export a JSON file if you want a backup, then import it in another browser.
      </p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className={primaryButton} onClick={exportData}>Export JSON</button>
        <label className={ghostButton}>
          Import JSON
          <input className="sr-only" type="file" accept="application/json,.json" onChange={onImport} />
        </label>
        <button type="button" className={ghostButton} onClick={() => setPending('reset')}>
          Restore original records
        </button>
      </div>
      {notice && <p className="text-sm text-muted">{notice}</p>}
      {errors.length > 0 && (
        <div className="rounded-2xl border border-flare/40 bg-flare/10 p-4 text-sm">
          <p className="font-semibold">The file was not imported.</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <ConfirmationModal
        open={Boolean(pending)}
        title={pending === 'reset' ? 'Restore original records?' : 'Replace current data?'}
        message={
          pending === 'reset'
            ? 'This replaces the records saved in this browser with the club records shipped in the website.'
            : 'Importing replaces players, matches, gallery details, settings, and saved request drafts in this browser.'
        }
        confirmLabel={pending === 'reset' ? 'Reset' : 'Import'}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          if (pending === 'reset') {
            club.resetSampleData()
            setNotice('Original club records restored in this browser.')
          } else {
            club.replaceState(pending)
            setNotice('Imported data is now saved in this browser.')
          }
          setErrors([])
          setPending(null)
        }}
      />
    </div>
  )
}
