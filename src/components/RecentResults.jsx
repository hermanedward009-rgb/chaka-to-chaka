import { Link } from 'react-router-dom'
import EmptyState from './EmptyState.jsx'
import MatchCard from './MatchCard.jsx'

export default function RecentResults({ matches, settings }) {
  const recent = matches
    .filter((match) => match.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-display text-5xl uppercase leading-none">Results</h2>
        <Link to="/matches" className="text-sm font-semibold text-flare">
          All results
        </Link>
      </div>
      {recent.length === 0 ? (
        <EmptyState title="No results yet">Completed matches and set scores will show up here.</EmptyState>
      ) : (
        <div className="grid gap-4">
          {recent.map((match) => (
            <MatchCard key={match.id} match={match} settings={settings} />
          ))}
        </div>
      )}
    </section>
  )
}
