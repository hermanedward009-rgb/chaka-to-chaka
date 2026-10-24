import { X } from 'lucide-react'
import { useEffect } from 'react'
import MediaImage from './MediaImage.jsx'

export default function PlayerProfileModal({ player, onClose }) {
  useEffect(() => {
    if (!player) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [player, onClose])

  if (!player) return null

  const facts = [
    ['Jersey', `#${player.number}`],
    ['Position', player.position],
    ['Height', player.height ? `${player.height} cm` : 'Not set'],
    ['Age', player.age || 'Not set'],
    ['Nationality', player.nationality || 'Not set'],
    ['Status', player.status === 'inactive' ? 'Inactive' : 'Active'],
    ['Previous club', player.previousClub || 'Not listed'],
  ]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/80 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-profile-title"
        className="my-6 grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-line bg-court shadow-2xl md:grid-cols-[0.8fr_1.2fr]"
        onClick={(event) => event.stopPropagation()}
      >
        <MediaImage
          src={player.photo}
          alt={`${player.name} portrait`}
          fallbackLabel={player.name}
          className="min-h-80 w-full"
        />
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-flare">{player.position}</p>
              <h2 id="player-profile-title" className="mt-2 font-display text-5xl uppercase leading-none">
                {player.name}
              </h2>
            </div>
            <button
              type="button"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line"
              aria-label="Close profile"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-[0.16em] text-faint">{label}</dt>
                <dd className="mt-1 text-sm">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm leading-6 text-muted">{player.biography || 'No biography yet.'}</p>
        </div>
      </div>
    </div>
  )
}
