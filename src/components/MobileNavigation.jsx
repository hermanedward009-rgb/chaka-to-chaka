import { X } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/squad', label: 'Squad' },
  { to: '/matches', label: 'Matches' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/request', label: 'Request a Match' },
  { to: '/admin', label: 'Admin' },
]

export default function MobileNavigation({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-ink/95 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="flex items-center justify-between px-4 py-4">
        <p className="font-display text-2xl uppercase">Menu</p>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-line"
          aria-label="Close menu"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <nav className="flex flex-col px-4" aria-label="Mobile">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onClose}
            className={({ isActive }) =>
              `border-b border-line py-4 font-display text-4xl uppercase ${isActive ? 'text-flare' : 'text-sand'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 pt-6">
        <ThemeToggle />
      </div>
    </div>
  )
}
