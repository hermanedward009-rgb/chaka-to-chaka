import { useState } from 'react'
import { useClubData } from '../hooks/useClubData.js'
import { MEDIA_GUIDE, readFileAsDataUrl } from '../utils/media.js'
import { inputClass } from '../utils/ui.js'
import Field from './Field.jsx'
import MediaImage from './MediaImage.jsx'

function AssetField({ label, value, onChange, acceptHint, fit = 'cover' }) {
  const [error, setError] = useState('')

  async function onFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      onChange(await readFileAsDataUrl(file, 700_000))
      setError('')
    } catch (readError) {
      setError(readError.message)
    }
  }

  return (
    <div className="rounded-3xl border border-line p-4">
      <MediaImage
        src={value}
        alt=""
        fallbackLabel={label}
        fit={fit}
        className={`mb-4 aspect-video w-full rounded-2xl ${fit === 'contain' ? 'bg-white' : ''}`}
      />
      <Field label={`${label} path`} htmlFor={`${label}-path`} hint={acceptHint}>
        <input
          id={`${label}-path`}
          className={inputClass}
          value={value.startsWith('data:') ? '' : value}
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
      <div className="mt-3">
        <Field label={`Upload ${label.toLowerCase()}`} htmlFor={`${label}-file`} error={error}>
          <input id={`${label}-file`} className={inputClass} type="file" accept="image/*" onChange={onFile} />
        </Field>
      </div>
    </div>
  )
}

export default function LogoManager() {
  const { settings, updateSettings } = useClubData()

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-muted">{MEDIA_GUIDE}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        <AssetField label="Club logo" fit="contain" value={settings.logo} onChange={(logo) => updateSettings({ logo })} acceptHint="The current mark is /images/logo.jpg. Replace that file, or paste another path." />
        <AssetField label="Hero image" value={settings.heroImage} onChange={(heroImage) => updateSettings({ heroImage })} acceptHint="Wide action photo. Permanent file: /images/hero.jpg" />
      </div>
    </div>
  )
}
