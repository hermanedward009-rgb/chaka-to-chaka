import { useState } from 'react'
import { createId } from '../utils/ids.js'
import { inputClass, primaryButton } from '../utils/ui.js'
import { useClubData } from '../hooks/useClubData.js'
import Field from './Field.jsx'

export default function SettingsForm() {
  const { settings, updateSettings } = useClubData()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  function update(field, value) {
    setSaved(false)
    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateSocial(field, value) {
    setSaved(false)
    setForm((current) => ({ ...current, socials: { ...current.socials, [field]: value } }))
  }

  function updateAnnouncement(id, field, value) {
    setSaved(false)
    setForm((current) => ({
      ...current,
      announcements: current.announcements.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
  }

  function onSubmit(event) {
    event.preventDefault()
    updateSettings({
      name: form.name.trim(),
      shortName: form.shortName.trim() || form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      founded: form.founded.trim(),
      location: form.location.trim(),
      venue: form.venue.trim(),
      email: form.email.trim(),
      whatsapp: form.whatsapp.replace(/\D/g, ''),
      phoneDisplay: form.phoneDisplay.trim(),
      socials: {
        instagram: form.socials.instagram.trim(),
        facebook: form.socials.facebook.trim(),
        x: form.socials.x.trim(),
        youtube: form.socials.youtube.trim(),
        tiktok: form.socials.tiktok.trim(),
      },
      announcements: form.announcements
        .filter((item) => item.title.trim() && item.body.trim())
        .map((item) => ({ ...item, title: item.title.trim(), body: item.body.trim(), date: item.date })),
    })
    setSaved(true)
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Club name" htmlFor="club-name">
          <input id="club-name" className={inputClass} value={form.name} onChange={(event) => update('name', event.target.value)} required />
        </Field>
        <Field label="Short name" htmlFor="short-name">
          <input id="short-name" className={inputClass} value={form.shortName} onChange={(event) => update('shortName', event.target.value)} />
        </Field>
        <Field label="Tagline" htmlFor="tagline">
          <input id="tagline" className={inputClass} value={form.tagline} onChange={(event) => update('tagline', event.target.value)} />
        </Field>
        <Field label="Founded, optional" htmlFor="founded">
          <input id="founded" className={inputClass} value={form.founded} onChange={(event) => update('founded', event.target.value)} />
        </Field>
        <Field label="Location" htmlFor="location">
          <input id="location" className={inputClass} value={form.location} onChange={(event) => update('location', event.target.value)} />
        </Field>
        <Field label="Home venue" htmlFor="venue">
          <input id="venue" className={inputClass} value={form.venue} onChange={(event) => update('venue', event.target.value)} />
        </Field>
        <Field label="Club email" htmlFor="club-email" hint="Used by the mailto request button.">
          <input id="club-email" type="email" className={inputClass} value={form.email} onChange={(event) => update('email', event.target.value)} />
        </Field>
        <Field label="WhatsApp number" htmlFor="whatsapp" hint="Country code and number, digits only. Example: 254712345678.">
          <input id="whatsapp" className={inputClass} value={form.whatsapp} onChange={(event) => update('whatsapp', event.target.value)} />
        </Field>
        <Field label="Phone display" htmlFor="phone-display">
          <input id="phone-display" className={inputClass} value={form.phoneDisplay} onChange={(event) => update('phoneDisplay', event.target.value)} />
        </Field>
      </div>
      <Field label="Description" htmlFor="description">
        <textarea id="description" rows="4" className={inputClass} value={form.description} onChange={(event) => update('description', event.target.value)} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        {['instagram', 'facebook', 'x', 'youtube', 'tiktok'].map((network) => (
          <Field key={network} label={`${network} URL`} htmlFor={network}>
            <input id={network} className={inputClass} value={form.socials[network]} onChange={(event) => updateSocial(network, event.target.value)} placeholder="https://" />
          </Field>
        ))}
      </div>
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-3xl uppercase">Announcements</h3>
          <button
            type="button"
            className="text-sm font-semibold text-flare"
            onClick={() =>
              update('announcements', [
                ...form.announcements,
                { id: createId('announcement'), title: '', date: '', body: '' },
              ])
            }
          >
            Add announcement
          </button>
        </div>
        <div className="space-y-4">
          {form.announcements.map((item) => (
            <div key={item.id} className="rounded-2xl border border-line p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <input className={inputClass} value={item.title} aria-label="Announcement title" onChange={(event) => updateAnnouncement(item.id, 'title', event.target.value)} />
                <input className={inputClass} type="date" value={item.date} aria-label="Announcement date" onChange={(event) => updateAnnouncement(item.id, 'date', event.target.value)} />
              </div>
              <textarea className={`${inputClass} mt-3`} rows="3" value={item.body} aria-label="Announcement body" onChange={(event) => updateAnnouncement(item.id, 'body', event.target.value)} />
              <button
                type="button"
                className="mt-2 text-sm text-flare"
                onClick={() => update('announcements', form.announcements.filter((entry) => entry.id !== item.id))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" className={primaryButton}>Save club settings</button>
      {saved && <p className="text-sm text-muted">Settings saved in this browser.</p>}
    </form>
  )
}
