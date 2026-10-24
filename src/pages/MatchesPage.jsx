import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import MatchCard from '../components/MatchCard.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatisticCard from '../components/StatisticCard.jsx'
import { useClubData } from '../hooks/useClubData.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { formatPercent } from '../utils/format.js'
import { clubOutcome, computeStatistics } from '../utils/statistics.js'
import { inputClass } from '../utils/ui.js'

const rank = { upcoming: 0, postponed: 1, completed: 2, cancelled: 3 }

export default function MatchesPage() {
  const { matches, players, settings } = useClubData()
  const [status, setStatus] = useState('all')
  const [result, setResult] = useState('all')
  const [competition, setCompetition] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  usePageTitle('Matches')
  const stats = computeStatistics(matches, players)
  const competitions = [...new Set(matches.map((match) => match.competition))].sort()

  const visible = useMemo(() => {
    return matches
      .filter((match) => {
        if (status !== 'all' && match.status !== status) return false
        if (competition !== 'all' && match.competition !== competition) return false
        if (from && match.date < from) return false
        if (to && match.date > to) return false
        const outcome = clubOutcome(match).outcome
        if (result === 'wins' && outcome !== 'win') return false
        if (result === 'losses' && outcome !== 'loss') return false
        return true
      })
      .sort((a, b) => rank[a.status] - rank[b.status] || (a.status === 'completed' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)))
  }, [matches, status, result, competition, from, to])

  return (
    <div className="pb-16">
      <PageHeader eyebrow="Schedule" title="Matches">
        <p>Upcoming fixtures and completed results. Official wins and losses come only from completed matches, and the winner is the team that takes more sets.</p>
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 pb-6 sm:grid-cols-3">
        <StatisticCard label="Played" value={stats.played} hint={`${stats.wins} wins, ${stats.losses} losses`} />
        <StatisticCard label="Win percentage" value={formatPercent(stats.winPercentage)} />
        <StatisticCard label="Sets" value={`${stats.setsWon}-${stats.setsLost}`} hint={`${stats.pointsFor} points scored, ${stats.pointsAgainst} conceded`} />
      </div>
      <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-6 md:grid-cols-5">
        <select className={inputClass} aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">All statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="postponed">Postponed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className={inputClass} aria-label="Filter by result" value={result} onChange={(event) => setResult(event.target.value)}>
          <option value="all">Wins and losses</option>
          <option value="wins">Wins</option>
          <option value="losses">Losses</option>
        </select>
        <select className={inputClass} aria-label="Filter by competition" value={competition} onChange={(event) => setCompetition(event.target.value)}>
          <option value="all">All competitions</option>
          {competitions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <input className={inputClass} type="date" aria-label="From date" value={from} onChange={(event) => setFrom(event.target.value)} />
        <input className={inputClass} type="date" aria-label="To date" value={to} onChange={(event) => setTo(event.target.value)} />
      </div>
      <div className="mx-auto grid max-w-7xl gap-4 px-4">
        {visible.length === 0 ? (
          <EmptyState title="No matches">Nothing fits these filters.</EmptyState>
        ) : (
          visible.map((match) => <MatchCard key={match.id} match={match} settings={settings} />)
        )}
      </div>
    </div>
  )
}
