import { Calendar, MapPin } from 'lucide-react'
import { formatDate, formatTime, titleCaseStatus } from '../utils/format.js'
import { clubOutcome, evaluateSets, resolveSides } from '../utils/statistics.js'
import MatchScoreboard from './MatchScoreboard.jsx'
import MediaImage from './MediaImage.jsx'

const statusClass = {
  upcoming: 'bg-flare/15 text-flare',
  completed: 'bg-surface text-sand',
  postponed: 'bg-amber-300/15 text-amber-200',
  cancelled: 'bg-surface text-faint',
}

function Side({ team, align }) {
  return (
    <div className={`min-w-0 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <MediaImage
        src={team.logo}
        alt=""
        fallbackLabel={team.name}
        fit="contain"
        className={`h-14 w-14 rounded-full bg-white p-0.5 sm:h-16 sm:w-16 ${align === 'right' ? 'ml-auto' : ''}`}
      />
      <p className="mt-3 break-words font-display text-2xl uppercase leading-none sm:text-3xl">{team.name}</p>
    </div>
  )
}

export default function MatchCard({ match, settings }) {
  const sides = resolveSides(match, settings)
  const summary = evaluateSets(match.sets)
  const result = clubOutcome(match)

  return (
    <article className="overflow-hidden rounded-3xl border border-line bg-card shadow-xl shadow-black/30">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-flare">
          {match.competition} · {match.matchType}
        </p>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${statusClass[match.status] || statusClass.upcoming}`}>
          {titleCaseStatus(match.status)}
        </span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-6 sm:px-6">
        <Side team={sides.home} />
        <div className="text-center">
          {match.status === 'completed' && summary.playedSets.length > 0 ? (
            <p className="font-display text-4xl leading-none sm:text-5xl">
              {summary.homeSets}
              <span className="text-flare">–</span>
              {summary.awaySets}
            </p>
          ) : (
            <p className="font-display text-3xl text-faint">VS</p>
          )}
          {result.outcome && (
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Club {result.outcome}
            </p>
          )}
        </div>
        <Side team={sides.away} align="right" />
      </div>
      {summary.playedSets.length > 0 && (
        <div className="px-5 pb-4">
          <MatchScoreboard match={match} compact />
        </div>
      )}
      <div className="flex flex-wrap gap-4 border-t border-line px-5 py-3 text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <Calendar size={15} aria-hidden="true" />
          {formatDate(match.date)} · {formatTime(match.time)}
        </span>
        <span className="inline-flex items-center gap-2">
          <MapPin size={15} aria-hidden="true" />
          {match.venue}
        </span>
        <span className="uppercase tracking-wider">{match.clubSide === 'away' ? 'Away' : 'Home'}</span>
      </div>
    </article>
  )
}
