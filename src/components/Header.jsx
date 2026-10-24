import { Menu, Volleyball } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useClubData } from '../hooks/useClubData.js'
import MediaImage from './MediaImage.jsx'
import MobileNavigation from './MobileNavigation.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/squad', label: 'Squad' },
  { to: '/matches', label: 'Matches' },
  { to: '/gallery', label: 'Gallery' },
]

function navClass({ isActive }) {
  return `text-sm font-semibold uppercase tracking-[0.16em] transition ${
    isActive ? 'text-flare' : 'text-muted hover:text-sand'
  }`
}

export default function Header() {
  const { settings } = useClubData()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <MediaImage
            src={settings.logo}
            alt=""
            eager
            fit="contain"
            className="h-12 w-12 shrink-0 rounded-full bg-white p-0.5"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-2xl uppercase leading-none tracking-wide">
              {settings.shortName}
            </span>
            <span className="mt-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
              <Volleyball size={12} aria-hidden="true" />
              Volleyball Club
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/admin" className={navClass}>
            Admin
          </NavLink>
          <Link
            to="/request"
            className="rounded-full bg-flare px-4 py-2 text-sm font-semibold text-on-flare shadow-glow transition hover:brightness-110"
          >
            Request a Match
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-line lg:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      <MobileNavigation open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
