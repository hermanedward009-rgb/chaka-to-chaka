import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useClubData } from '../hooks/useClubData.js'
import { formatDate } from '../utils/format.js'
import MediaImage from './MediaImage.jsx'

export default function HeroSection() {
  const { settings, matches } = useClubData()
  const next = matches
    .filter((match) => match.status === 'upcoming')
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  return (
    <section className="court-grid relative overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div className="rise">
          <MediaImage
            src={settings.logo}
            alt={`${settings.name} logo`}
            eager
            fit="contain"
            className="h-24 w-24 rounded-full bg-white p-1"
          />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-flare">
            {settings.tagline}
          </p>
          <h1 className="mt-3 max-w-full font-display text-5xl uppercase leading-[0.88] sm:text-7xl lg:text-8xl">
            {settings.shortName}
            <span className="mt-2 block text-flare">Volleyball Club</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted">{settings.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/squad" className="rounded-full bg-flare px-5 py-3 text-sm font-semibold text-on-flare hover:brightness-110">
              Meet the Squad
            </Link>
            <Link to="/matches" className="rounded-full border border-line px-5 py-3 text-sm font-semibold hover:border-flare">
              View Matches
            </Link>
            <Link to="/request" className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold hover:border-flare">
              Request a Match
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative rise">
          <MediaImage
            src={settings.heroImage}
            alt={`${settings.name}`}
            eager
            className="aspect-[16/11] w-full rounded-[2rem] border border-line shadow-2xl shadow-black"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-3xl border border-line bg-court/95 p-4 backdrop-blur sm:right-auto sm:min-w-72">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-flare">Next match</p>
            {next ? (
              <>
                <p className="mt-1 font-display text-3xl uppercase leading-none">vs {next.opponent}</p>
                <p className="mt-2 text-sm text-muted">
                  {formatDate(next.date)} · {next.venue}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">No upcoming match is scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
