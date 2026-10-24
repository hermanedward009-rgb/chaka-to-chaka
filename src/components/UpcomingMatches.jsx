import { Link } from 'react-router-dom'
import EmptyState from './EmptyState.jsx'
import MatchCard from './MatchCard.jsx'

export default function UpcomingMatches({ matches, settings }) {
  const upcoming = matches
    .filter((match) => match.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-display text-5xl uppercase leading-none">Upcoming</h2>
        <Link to="/matches" className="text-sm font-semibold text-flare">
          Full schedule
        </Link>
      </div>
      {upcoming.length === 0 ? (
        <EmptyState title="No fixtures yet">Add an upcoming match in the admin panel.</EmptyState>
      ) : (
        <div className="grid gap-4">
          {upcoming.map((match) => (
            <MatchCard key={match.id} match={match} settings={settings} />
          ))}
        </div>
      )}
    </section>
  )
}
