import { Link2, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useClubData } from '../hooks/useClubData.js'
import MediaImage from './MediaImage.jsx'

const pageLinks = [
  ['/', 'Home'],
  ['/squad', 'Squad'],
  ['/matches', 'Matches'],
  ['/gallery', 'Gallery'],
  ['/request', 'Request a Match'],
  ['/admin', 'Admin'],
]

export default function Footer() {
  const { settings } = useClubData()
  const showEmail = settings.email && settings.email !== 'club@example.com'
  const showPhone = settings.phoneDisplay && !settings.phoneDisplay.includes('700 000 000')
  const showLocation = Boolean(settings.location)
  const hasContact = showEmail || showPhone || showLocation
  const socials = [
    ['Instagram', settings.socials.instagram],
    ['Facebook', settings.socials.facebook],
    ['X', settings.socials.x],
    ['YouTube', settings.socials.youtube],
    ['TikTok', settings.socials.tiktok],
  ].filter(([, href]) => href)

  return (
    <footer className="mt-16 border-t border-line bg-court">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <MediaImage src={settings.logo} alt="" fit="contain" className="h-14 w-14 rounded-full bg-white p-0.5" />
            <p className="font-display text-3xl uppercase leading-none">{settings.shortName}</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{settings.description}</p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-flare">Explore</h2>
          <ul className="mt-4 space-y-2">
            {pageLinks.map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-sm text-muted hover:text-sand">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {hasContact && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-flare">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {showEmail && (
              <li className="flex gap-2">
                <Mail size={16} className="mt-0.5 shrink-0 text-flare" aria-hidden="true" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            {showPhone && (
              <li className="flex gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-flare" aria-hidden="true" />
                <span>{settings.phoneDisplay}</span>
              </li>
            )}
            {showLocation && (
              <li className="flex gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-flare" aria-hidden="true" />
                <span>{settings.location}</span>
              </li>
            )}
          </ul>
        </div>
        )}
        {socials.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-flare">Social</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {socials.map(([name, href]) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-flare"
                >
                  <Link2 size={14} aria-hidden="true" />
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>
      <div className="border-t border-line px-4 py-4 text-center text-xs text-faint">
        {settings.name}
      </div>
    </footer>
  )
}
