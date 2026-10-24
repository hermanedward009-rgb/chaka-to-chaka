import { useState } from 'react'
import { getAdminPassword, setAdminPassword } from '../utils/adminAuth.js'
import { inputClass, primaryButton } from '../utils/ui.js'
import Field from './Field.jsx'

export default function PasswordForm() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function onSubmit(event) {
    event.preventDefault()
    setSaved(false)
    if (current !== getAdminPassword()) {
      setError('The current password is not correct.')
      return
    }
    if (next.length < 6) {
      setError('Use at least 6 characters for the new password.')
      return
    }
    if (next !== confirm) {
      setError('The new password and confirmation do not match.')
      return
    }
    setAdminPassword(next)
    setCurrent('')
    setNext('')
    setConfirm('')
    setError('')
    setSaved(true)
  }

  return (
    <form className="max-w-lg space-y-4" onSubmit={onSubmit}>
      <div>
        <h2 className="font-display text-5xl uppercase leading-none">Password</h2>
        <p className="mt-3 text-sm leading-6 text-muted">
          This password opens the admin panel on this browser. Choose a new one and keep it private.
        </p>
      </div>
      <Field label="Current password" htmlFor="current-password">
        <input id="current-password" type="password" autoComplete="current-password" className={inputClass} value={current} onChange={(event) => setCurrent(event.target.value)} />
      </Field>
      <Field label="New password" htmlFor="new-password">
        <input id="new-password" type="password" autoComplete="new-password" className={inputClass} value={next} onChange={(event) => setNext(event.target.value)} />
      </Field>
      <Field label="Confirm new password" htmlFor="confirm-password">
        <input id="confirm-password" type="password" autoComplete="new-password" className={inputClass} value={confirm} onChange={(event) => setConfirm(event.target.value)} />
      </Field>
      {error && <p className="text-sm text-flare">{error}</p>}
      <button type="submit" className={primaryButton}>Save password</button>
      {saved && <p className="text-sm text-muted">Password updated on this browser.</p>}
    </form>
  )
}
