import MediaImage from './MediaImage.jsx'

export default function PlayerCard({ player, onOpen }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-line bg-card shadow-xl shadow-black/30 transition duration-300 hover:-translate-y-1 hover:border-flare/70">
      <button type="button" className="block w-full text-left" onClick={() => onOpen(player)}>
        <div className="relative">
          <MediaImage
            src={player.photo}
            alt={`${player.name} portrait`}
            fallbackLabel={player.name}
            className="aspect-[4/5] w-full"
          />
          <span className="absolute left-4 top-4 rounded-full bg-flare px-3 py-1 font-display text-xl leading-none text-on-flare">
            #{player.number}
          </span>
          <span className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            {player.status === 'inactive' ? 'Inactive' : 'Active'}
          </span>
        </div>
        <div className="p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-flare">{player.position}</p>
          <h2 className="mt-1 font-display text-4xl uppercase leading-none">{player.name}</h2>
          <p className="mt-3 text-sm text-muted">
            {player.height ? `${player.height} cm` : 'Height not set'}
            {' · '}
            {player.age ? `${player.age}` : 'Age not set'}
            {' · '}
            {player.nationality || 'Nationality not set'}
          </p>
        </div>
      </button>
    </article>
  )
}
