import { useState } from 'react'
import ConfirmationModal from '../../components/ConfirmationModal.jsx'
import MatchForm from '../../components/MatchForm.jsx'
import { useClubData } from '../../hooks/useClubData.js'
import { createId } from '../../utils/ids.js'
import { formatDate, titleCaseStatus } from '../../utils/format.js'
import { ghostButton } from '../../utils/ui.js'

function blankMatch() {
  return {
    id: createId('match'),
    opponent: '',
    opponentLogo: '',
    clubSide: 'home',
    date: '',
    time: '',
    venue: '',
    competition: '',
    matchType: 'Friendly',
    format: 'best-of-5',
    status: 'upcoming',
    sets: [],
  }
}

export default function MatchesAdmin() {
  const { matches, saveMatch, deleteMatch } = useClubData()
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const ordered = [...matches].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none">Matches</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            Schedule a match or record set scores. Dashboard totals update from completed matches.
          </p>
        </div>
        <button type="button" className={ghostButton} onClick={() => setEditing(blankMatch())}>
          Add match
        </button>
      </div>
      {editing && (
        <MatchForm
          key={editing.id}
          match={editing}
          onCancel={() => setEditing(null)}
          onSave={(match) => {
            saveMatch(match)
            setEditing(null)
          }}
        />
      )}
      <ul className="space-y-3">
        {ordered.map((match) => (
          <li key={match.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3">
            <div>
              <p className="font-semibold">vs {match.opponent}</p>
              <p className="text-sm text-muted">
                {formatDate(match.date)} · {titleCaseStatus(match.status)} · {match.clubSide}
              </p>
            </div>
            <div className="flex gap-4">
              <button type="button" className="text-sm font-semibold text-flare" onClick={() => setEditing(match)}>Edit</button>
              <button type="button" className="text-sm text-muted" onClick={() => setPendingDelete(match)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title="Delete this match?"
        message={pendingDelete ? `The match against ${pendingDelete.opponent} will be removed from this browser, and the statistics will update.` : ''}
        confirmLabel="Delete match"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteMatch(pendingDelete.id)
          setPendingDelete(null)
          setEditing(null)
        }}
      />
    </div>
  )
}
