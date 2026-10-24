import { Percent, Trophy, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import GalleryGrid from '../components/GalleryGrid.jsx'
import GalleryLightbox from '../components/GalleryLightbox.jsx'
import HeroSection from '../components/HeroSection.jsx'
import PerformanceChart from '../components/PerformanceChart.jsx'
import PlayerCard from '../components/PlayerCard.jsx'
import PlayerProfileModal from '../components/PlayerProfileModal.jsx'
import RecentResults from '../components/RecentResults.jsx'
import StatisticCard from '../components/StatisticCard.jsx'
import UpcomingMatches from '../components/UpcomingMatches.jsx'
import { useClubData } from '../hooks/useClubData.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { formatDate, formatPercent } from '../utils/format.js'
import { computeStatistics } from '../utils/statistics.js'

export default function HomePage() {
  const { settings, players, matches, gallery } = useClubData()
  const stats = computeStatistics(matches, players)
  const [player, setPlayer] = useState(null)
  const [galleryIndex, setGalleryIndex] = useState(null)
  usePageTitle('Home')

  const featuredSource = players.filter((item) => item.featured && item.status !== 'inactive')
  const featured = (featuredSource.length ? featuredSource : players.filter((item) => item.status !== 'inactive')).slice(0, 4)
  const photos = [...gallery].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  const announcements = [...settings.announcements].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <HeroSection />
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatisticCard label="Players" value={stats.totalPlayers} hint={`${stats.activePlayers} active`} icon={Users} />
          <StatisticCard label="Matches played" value={stats.played} hint="Completed, with a winner" icon={Trophy} />
          <StatisticCard label="Wins" value={stats.wins} />
          <StatisticCard label="Losses" value={stats.losses} />
          <StatisticCard label="Win percentage" value={formatPercent(stats.winPercentage)} icon={Percent} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 lg:grid-cols-2">
        <UpcomingMatches matches={matches} settings={settings} />
        <RecentResults matches={matches} settings={settings} />
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[2rem] border border-line bg-card p-5">
          <h2 className="font-display text-5xl uppercase leading-none">Match performance</h2>
          <p className="mt-3 text-sm text-muted">Sets won and lost in each completed match. Wins are counted from sets, not from total points.</p>
          <div className="mt-6">
            <PerformanceChart performance={stats.performance} />
          </div>
        </div>
        <div className="rounded-[2rem] border border-line bg-card p-5">
          <h2 className="font-display text-4xl uppercase">Season totals</h2>
          <dl className="mt-6 space-y-4">
            {[
              ['Sets won', stats.setsWon],
              ['Sets lost', stats.setsLost],
              ['Points scored', stats.pointsFor],
              ['Points conceded', stats.pointsAgainst],
            ].map(([label, value]) => (
              <div key={label} className="flex items-end justify-between border-b border-line pb-3">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="font-display text-4xl leading-none">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-5xl uppercase leading-none">Featured players</h2>
          <Link to="/squad" className="text-sm font-semibold text-flare">Full squad</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <PlayerCard key={item.id} player={item} onOpen={setPlayer} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-5xl uppercase leading-none">Gallery</h2>
          <Link to="/gallery" className="text-sm font-semibold text-flare">Open gallery</Link>
        </div>
        <GalleryGrid items={photos} onOpen={(item) => setGalleryIndex(photos.findIndex((photo) => photo.id === item.id))} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <h2 className="font-display text-5xl uppercase leading-none">Announcements</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {announcements.map((item) => (
            <article key={item.id} className="rounded-3xl border border-line bg-card p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-flare">{formatDate(item.date)}</p>
              <h3 className="mt-3 font-display text-3xl uppercase leading-none">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="rounded-[2rem] bg-flare px-6 py-10 text-on-flare sm:px-10">
          <h2 className="font-display text-5xl uppercase leading-none sm:text-6xl">Want a match?</h2>
          <p className="mt-3 max-w-xl text-sm leading-6">
            Send a request through WhatsApp or email. The message is only delivered after you press Send in that app.
          </p>
          <Link to="/request" className="mt-6 inline-flex rounded-full bg-on-flare px-5 py-3 text-sm font-semibold text-flare shadow-none">
            Request a Match
          </Link>
        </div>
      </section>

      <PlayerProfileModal player={player} onClose={() => setPlayer(null)} />
      <GalleryLightbox items={photos} index={galleryIndex} onClose={() => setGalleryIndex(null)} onIndex={setGalleryIndex} />
    </div>
  )
}
