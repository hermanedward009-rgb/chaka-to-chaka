import {
  Download,
  Image,
  KeyRound,
  LayoutDashboard,
  Settings,
  Shield,
  Trophy,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  ['/admin/overview', 'Overview', LayoutDashboard],
  ['/admin/players', 'Players', Users],
  ['/admin/matches', 'Matches', Trophy],
  ['/admin/branding', 'Team logo', Shield],
  ['/admin/gallery', 'Gallery', Image],
  ['/admin/settings', 'Club settings', Settings],
  ['/admin/password', 'Password', KeyRound],
  ['/admin/data', 'Import / export', Download],
]

export default function AdminSidebar({ onLogout }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label="Admin">
        {items.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                isActive ? 'bg-flare text-on-flare' : 'border border-line text-muted hover:border-flare'
              }`
            }
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
        <button type="button" className="shrink-0 rounded-full border border-line px-4 py-2 text-sm text-muted" onClick={onLogout}>
          Lock panel
        </button>
      </nav>
    </aside>
  )
}
