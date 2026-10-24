import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.js'

const modes = [
  ['light', 'Light mode', Sun],
  ['dark', 'Dark mode', Moon],
]

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1" role="group" aria-label="Color mode">
      {modes.map(([mode, label, Icon]) => {
        const active = theme === mode
        return (
          <button
            key={mode}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(mode)}
            className={`grid h-9 w-9 place-items-center rounded-full transition ${
              active ? 'bg-flare text-on-flare shadow-glow' : 'text-muted hover:text-sand'
            }`}
          >
            <Icon size={16} aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
