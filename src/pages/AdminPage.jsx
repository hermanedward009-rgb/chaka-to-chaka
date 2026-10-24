import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar.jsx'
import { ADMIN_SESSION_KEY } from '../data/constants.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { getAdminPassword } from '../utils/adminAuth.js'
import { inputClass, primaryButton } from '../utils/ui.js'

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'
    } catch {
      return false
    }
  })
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  usePageTitle('Admin')

  function unlock(event) {
    event.preventDefault()
    if (password === getAdminPassword()) {
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, '1')
      } catch {
        /* The panel can still open for this visit. */
      }
      setUnlocked(true)
      setError('')
      return
    }
    setError('That password is not correct.')
  }

  function logout() {
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY)
    } catch {
      /* Ignore storage failures and lock the view anyway. */
    }
    setUnlocked(false)
    setPassword('')
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-flare">Club staff</p>
        <h1 className="mt-2 font-display text-6xl uppercase leading-none">Admin</h1>
        <form className="mt-6 space-y-4" onSubmit={unlock}>
          <label className="block text-sm" htmlFor="admin-password">
            Password
            <input
              id="admin-password"
              type="password"
              className={`${inputClass} mt-2`}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error && <p className="text-sm text-flare">{error}</p>}
          <button type="submit" className={primaryButton}>Sign in</button>
        </form>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <AdminSidebar onLogout={logout} />
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
