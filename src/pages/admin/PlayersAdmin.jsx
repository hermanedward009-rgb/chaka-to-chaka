import { useState } from 'react'
import ConfirmationModal from '../../components/ConfirmationModal.jsx'
import PlayerForm from '../../components/PlayerForm.jsx'
import { useClubData } from '../../hooks/useClubData.js'
import { createId } from '../../utils/ids.js'
import { ghostButton } from '../../utils/ui.js'
import MediaImage from '../../components/MediaImage.jsx'

function blankPlayer() {
  return {
    id: createId('player'),
    name: '',
    photo: '',
    number: '',
    position: 'Outside Hitter',
    height: '',
    age: '',
    nationality: '',
    biography: '',
    previousClub: '',
    status: 'active',
    featured: false,
  }
}

export default function PlayersAdmin() {
  const { players, savePlayer, deletePlayer } = useClubData()
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const ordered = [...players].sort((a, b) => Number(a.number) - Number(b.number))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none">Players</h2>
          <p className="mt-2 text-sm text-muted">Add, edit, or remove roster records stored in this browser.</p>
        </div>
        <button type="button" className={ghostButton} onClick={() => setEditing(blankPlayer())}>
          Add player
        </button>
      </div>
      {editing && (
        <PlayerForm
          key={editing.id}
          player={editing}
          players={players}
          onCancel={() => setEditing(null)}
          onSave={(player) => {
            savePlayer(player)
            setEditing(null)
          }}
        />
      )}
      <ul className="space-y-3">
        {ordered.map((player) => (
          <li key={player.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line p-3">
            <MediaImage src={player.photo} alt="" fallbackLabel={player.name} className="h-16 w-14 rounded-xl" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">#{player.number} {player.name}</p>
              <p className="text-sm text-muted">{player.position} · {player.status}</p>
            </div>
            <button type="button" className="text-sm font-semibold text-flare" onClick={() => setEditing(player)}>Edit</button>
            <button type="button" className="text-sm text-muted" onClick={() => setPendingDelete(player)}>Remove</button>
          </li>
        ))}
      </ul>
      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title="Remove this player?"
        message={pendingDelete ? `${pendingDelete.name} will be removed from this browser’s roster.` : ''}
        confirmLabel="Remove player"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deletePlayer(pendingDelete.id)
          setPendingDelete(null)
          setEditing(null)
        }}
      />
    </div>
  )
}
