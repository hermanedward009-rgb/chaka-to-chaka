import { Percent, Trophy, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useClubData } from '../hooks/useClubData.js'
import { formatDate, formatPercent } from '../utils/format.js'
import { computeStatistics } from '../utils/statistics.js'
import StatisticCard from './StatisticCard.jsx'

export default function AdminDashboard() {
  const { players, matches, gallery, requests, deleteRequest, settings } = useClubData()
  const stats = computeStatistics(matches, players)
  const next = matches
    .filter((match) => match.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-5xl uppercase leading-none">Overview</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Changes you save here stay on this computer. Export a backup from Import / export before you publish a new version of the site.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatisticCard label="Players" value={stats.totalPlayers} hint={`${stats.activePlayers} active`} icon={Users} />
        <StatisticCard label="Played" value={stats.played} hint="Completed matches with a winner" icon={Trophy} />
        <StatisticCard label="Record" value={`${stats.wins}-${stats.losses}`} hint="Wins and losses" />
        <StatisticCard label="Win percentage" value={formatPercent(stats.winPercentage)} icon={Percent} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-3xl border border-line p-5">
          <h3 className="font-display text-3xl uppercase">Next match</h3>
          {next ? (
            <p className="mt-3 text-sm text-muted">
              {formatDate(next.date)} vs {next.opponent} at {next.venue}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted">Nothing upcoming.</p>
          )}
          <Link to="/admin/matches" className="mt-4 inline-block text-sm font-semibold text-flare">
            Manage matches
          </Link>
        </article>
        <article className="rounded-3xl border border-line p-5">
          <h3 className="font-display text-3xl uppercase">Content</h3>
          <p className="mt-3 text-sm text-muted">{gallery.length} gallery items · contact {settings.email}</p>
          <Link to="/admin/gallery" className="mt-4 inline-block text-sm font-semibold text-flare">
            Manage gallery
          </Link>
        </article>
      </div>
      <section>
        <h3 className="font-display text-3xl uppercase">Request drafts on this device</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          These are forms that opened WhatsApp or email here. They are not confirmed deliveries. The club only receives a request after the visitor presses Send.
        </p>
        {requests.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No drafts yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {requests.map((request) => (
              <li key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3">
                <div>
                  <p className="font-semibold">{request.teamName}</p>
                  <p className="text-xs text-muted">
                    {request.reference} · {request.channel} · {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <button type="button" className="text-sm text-flare" onClick={() => deleteRequest(request.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
