import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function NotFoundPage() {
  usePageTitle('Page not found')

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-flare">404</p>
      <h1 className="mt-3 font-display text-7xl uppercase">Out of bounds</h1>
      <p className="mt-4 text-muted">That page is not part of this site.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-flare px-5 py-3 text-sm font-semibold text-on-flare">
        Back home
      </Link>
    </div>
  )
}
