import { useState } from 'react'
import { GALLERY_CATEGORIES } from '../data/constants.js'
import { validateGallery } from '../utils/forms.js'
import { extractYoutubeId, readFileAsDataUrl } from '../utils/media.js'
import { ghostButton, inputClass, primaryButton } from '../utils/ui.js'
import Field from './Field.jsx'

export default function GalleryForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item)
  const [errors, setErrors] = useState({})
  const [fileError, setFileError] = useState('')

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function onFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const limit = form.type === 'video' ? 1_200_000 : 900_000
    try {
      update('src', await readFileAsDataUrl(file, limit))
      setFileError('')
    } catch (error) {
      setFileError(error.message)
    }
  }

  function onSubmit(event) {
    event.preventDefault()
    const next = {
      ...form,
      caption: form.caption.trim(),
      alt: form.alt.trim() || form.caption.trim(),
      youtubeId: form.type === 'youtube' ? extractYoutubeId(form.youtubeId) : '',
      src: form.type === 'youtube' ? '' : form.src.trim(),
    }
    const nextErrors = validateGallery(next)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave(next)
  }

  return (
    <form className="rounded-3xl border border-line bg-surface p-5" onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Type" htmlFor="gallery-type">
          <select id="gallery-type" className={inputClass} value={form.type} onChange={(event) => update('type', event.target.value)}>
            <option value="image">Image</option>
            <option value="video">Video file</option>
            <option value="youtube">YouTube</option>
          </select>
        </Field>
        <Field label="Category" htmlFor="gallery-category" error={errors.category}>
          <select id="gallery-category" className={inputClass} value={form.category} onChange={(event) => update('category', event.target.value)}>
            {GALLERY_CATEGORIES.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </Field>
        <Field label="Date" htmlFor="gallery-date" error={errors.date}>
          <input id="gallery-date" type="date" className={inputClass} value={form.date} onChange={(event) => update('date', event.target.value)} />
        </Field>
        <Field label="Caption" htmlFor="gallery-caption" error={errors.caption}>
          <input id="gallery-caption" className={inputClass} value={form.caption} onChange={(event) => update('caption', event.target.value)} />
        </Field>
      </div>
      {form.type === 'youtube' ? (
        <div className="mt-4">
          <Field label="YouTube link or video id" htmlFor="youtube" error={errors.youtubeId} hint="The video plays from YouTube. This site does not download it.">
            <input id="youtube" className={inputClass} value={form.youtubeId} onChange={(event) => update('youtubeId', event.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </Field>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Project path" htmlFor="gallery-src" error={errors.src} hint="Permanent files belong in public/images or public/videos. Example: /videos/rally.mp4">
            <input
              id="gallery-src"
              className={inputClass}
              value={form.src.startsWith('data:') ? '' : form.src}
              onChange={(event) => update('src', event.target.value)}
            />
          </Field>
          <Field label="Or upload a small file" htmlFor="gallery-file" error={fileError} hint="Images under 900 KB, videos under 1.2 MB. Larger files must use a project path.">
            <input id="gallery-file" className={inputClass} type="file" accept={form.type === 'video' ? 'video/*' : 'image/*'} onChange={onFile} />
          </Field>
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className={primaryButton}>Save gallery item</button>
        <button type="button" className={ghostButton} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
