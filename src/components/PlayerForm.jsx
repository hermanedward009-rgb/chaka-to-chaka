import { useState } from 'react'
import { POSITIONS } from '../data/constants.js'
import { readFileAsDataUrl } from '../utils/media.js'
import { validatePlayer } from '../utils/forms.js'
import { ghostButton, inputClass, primaryButton } from '../utils/ui.js'
import Field from './Field.jsx'

export default function PlayerForm({ player, players, onSave, onCancel }) {
  const [form, setForm] = useState(player)
  const [errors, setErrors] = useState({})
  const [photoError, setPhotoError] = useState('')

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function onPhoto(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const photo = await readFileAsDataUrl(file, 900_000)
      update('photo', photo)
      setPhotoError('')
    } catch (error) {
      setPhotoError(error.message)
    }
  }

  function onSubmit(event) {
    event.preventDefault()
    const next = {
      ...form,
      name: form.name.trim(),
      nationality: form.nationality.trim(),
      biography: form.biography.trim(),
      previousClub: form.previousClub.trim(),
      number: form.number === '' ? '' : Number(form.number),
      height: form.height === '' ? '' : Number(form.height),
      age: form.age === '' ? '' : Number(form.age),
    }
    const nextErrors = validatePlayer(next, players)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave(next)
  }

  return (
    <form className="rounded-3xl border border-line bg-surface p-5" onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name" htmlFor="player-name" error={errors.name}>
          <input id="player-name" className={inputClass} value={form.name} onChange={(event) => update('name', event.target.value)} />
        </Field>
        <Field label="Jersey number" htmlFor="player-number" error={errors.number}>
          <input id="player-number" className={inputClass} inputMode="numeric" value={form.number} onChange={(event) => update('number', event.target.value)} />
        </Field>
        <Field label="Position" htmlFor="player-position" error={errors.position}>
          <select id="player-position" className={inputClass} value={form.position} onChange={(event) => update('position', event.target.value)}>
            {POSITIONS.map((position) => (
              <option key={position}>{position}</option>
            ))}
          </select>
        </Field>
        <Field label="Status" htmlFor="player-status">
          <select id="player-status" className={inputClass} value={form.status} onChange={(event) => update('status', event.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </Field>
        <Field label="Height (cm)" htmlFor="player-height" error={errors.height}>
          <input id="player-height" className={inputClass} inputMode="numeric" value={form.height} onChange={(event) => update('height', event.target.value)} />
        </Field>
        <Field label="Age" htmlFor="player-age" error={errors.age}>
          <input id="player-age" className={inputClass} inputMode="numeric" value={form.age} onChange={(event) => update('age', event.target.value)} />
        </Field>
        <Field label="Nationality" htmlFor="player-nationality">
          <input id="player-nationality" className={inputClass} value={form.nationality} onChange={(event) => update('nationality', event.target.value)} />
        </Field>
        <Field label="Previous club, optional" htmlFor="player-previous">
          <input id="player-previous" className={inputClass} value={form.previousClub} onChange={(event) => update('previousClub', event.target.value)} />
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Biography" htmlFor="player-bio">
          <textarea id="player-bio" rows="4" className={inputClass} value={form.biography} onChange={(event) => update('biography', event.target.value)} />
        </Field>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Photo path" htmlFor="player-photo" hint="Example: /images/players/player-01.svg. Use a path for a permanent site photo.">
          <input id="player-photo" className={inputClass} value={form.photo.startsWith('data:') ? '' : form.photo} placeholder="/images/players/photo.jpg" onChange={(event) => update('photo', event.target.value)} />
        </Field>
        <Field label="Or upload a small photo" htmlFor="player-file" error={photoError} hint="Uploads stay in this browser only and should stay under 900 KB.">
          <input id="player-file" className={inputClass} type="file" accept="image/*" onChange={onPhoto} />
        </Field>
      </div>
      <label className="mt-4 flex items-center gap-3 text-sm">
        <input type="checkbox" checked={form.featured} onChange={(event) => update('featured', event.target.checked)} />
        Feature this player on the homepage
      </label>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className={primaryButton}>Save player</button>
        <button type="button" className={ghostButton} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
