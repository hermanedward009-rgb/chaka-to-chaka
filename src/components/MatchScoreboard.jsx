import { clubOutcome, evaluateSets } from '../utils/statistics.js'

export default function MatchScoreboard({ match, compact = false }) {
  const summary = evaluateSets(match.sets)
  const result = clubOutcome(match)

  if (summary.playedSets.length === 0) return null

  return (
    <div className={compact ? '' : 'rounded-3xl border border-line bg-surface p-4'}>
      {!compact && (
        <>
          <p className="text-center font-display text-5xl leading-none">
            {summary.homeSets}
            <span className="px-2 text-flare">–</span>
            {summary.awaySets}
          </p>
          {result.outcome && (
            <p className="mt-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              Club {result.outcome}
            </p>
          )}
        </>
      )}
      <ol className={`flex flex-wrap justify-center gap-2 ${compact ? '' : 'mt-4'}`}>
        {summary.playedSets.map((set, index) => (
          <li key={`${match.id}-set-${index}`} className="rounded-full border border-line px-3 py-1 text-sm">
            Set {index + 1}: {set.home}–{set.away}
          </li>
        ))}
      </ol>
    </div>
  )
}
