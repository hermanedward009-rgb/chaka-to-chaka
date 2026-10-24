import { useMemo, useState } from 'react'
import { MATCH_TYPES } from '../data/constants.js'
import { useClubData } from '../hooks/useClubData.js'
import { createId, createReference } from '../utils/ids.js'
import { buildRequestMessage, mailtoUrl, validateRequest, whatsappUrl } from '../utils/forms.js'
import { inputClass } from '../utils/ui.js'
import Field from './Field.jsx'

const emptyForm = {
  teamName: '',
  contactName: '',
  phone: '',
  email: '',
  preferredDate: '',
  alternativeDate: '',
  preferredTime: '',
  venue: '',
  matchType: 'Friendly',
  homeAway: 'Either',
  contactMethod: 'WhatsApp',
  message: '',
  logoName: '',
}

export default function RequestMatchForm() {
  const { settings, addRequest } = useClubData()
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [prepared, setPrepared] = useState(null)
  const [copyNote, setCopyNote] = useState('')

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setPrepared(null)
  }

  function prepare(channel) {
    const nextErrors = validateRequest(values)
    setErrors(nextErrors)
    setCopyNote('')
    if (Object.keys(nextErrors).length) {
      setPrepared(null)
      return
    }

    if (channel === 'whatsapp' && settings.whatsapp.replace(/\D/g, '').length < 8) {
      setErrors({ form: 'Add a club WhatsApp number in Admin before using this button.' })
      return
    }
    if (channel === 'email' && !settings.email.includes('@')) {
      setErrors({ form: 'Add a club email address in Admin before using this button.' })
      return
    }

    const reference = createReference()
    const message = buildRequestMessage(values, reference, settings.name)
    const subject = `Match request ${reference} from ${values.teamName.trim()}`
    const href = channel === 'whatsapp'
      ? whatsappUrl(settings.whatsapp, message)
      : mailtoUrl(settings.email, subject, message)

    const draft = {
      id: createId('request'),
      reference,
      channel,
      teamName: values.teamName.trim(),
      contactName: values.contactName.trim(),
      createdAt: new Date().toISOString(),
      status: channel === 'whatsapp' ? 'whatsapp-opened' : 'email-opened',
    }
    addRequest(draft)
    setPrepared({ reference, message, href, channel })
    if (channel === 'email') {
      window.location.href = href
      return
    }
    const popup = window.open(href, '_blank', 'noopener,noreferrer')
    if (!popup) {
      setCopyNote('The browser blocked the new tab. Use the link below, then press Send in WhatsApp.')
    }
  }

  async function copyMessage() {
    if (!prepared) return
    try {
      await navigator.clipboard.writeText(prepared.message)
      setCopyNote('Message copied. Paste it only if the app did not fill it in, then press Send.')
    } catch {
      setCopyNote('Copy the message from the box below and press Send in WhatsApp or email.')
    }
  }

  const channelLabel = useMemo(
    () => (prepared?.channel === 'email' ? 'email app' : 'WhatsApp'),
    [prepared],
  )

  return (
    <form className="rounded-[2rem] border border-line bg-card p-5 shadow-xl shadow-black/30 sm:p-8" noValidate onSubmit={(event) => event.preventDefault()}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Requesting team" htmlFor="teamName" error={errors.teamName}>
          <input id="teamName" className={inputClass} value={values.teamName} onChange={(event) => update('teamName', event.target.value)} />
        </Field>
        <Field label="Team logo, optional" htmlFor="logo" hint="A logo cannot be attached through a WhatsApp or email link. Send it in the chat after it opens.">
          <input
            id="logo"
            className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-flare file:px-3 file:py-1 file:text-on-flare`}
            type="file"
            accept="image/*"
            onChange={(event) => update('logoName', event.target.files?.[0]?.name || '')}
          />
        </Field>
        <Field label="Contact person’s full name" htmlFor="contactName" error={errors.contactName}>
          <input id="contactName" className={inputClass} value={values.contactName} onChange={(event) => update('contactName', event.target.value)} autoComplete="name" />
        </Field>
        <Field label="Phone with country code" htmlFor="phone" error={errors.phone}>
          <input id="phone" className={inputClass} value={values.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+254 712 345 678" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" type="email" className={inputClass} value={values.email} onChange={(event) => update('email', event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} />
        </Field>
        <Field label="Preferred contact method" htmlFor="contactMethod" error={errors.contactMethod}>
          <select id="contactMethod" className={inputClass} value={values.contactMethod} onChange={(event) => update('contactMethod', event.target.value)}>
            {['WhatsApp', 'Email', 'Phone'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Preferred match date" htmlFor="preferredDate" error={errors.preferredDate}>
          <input id="preferredDate" type="date" className={inputClass} value={values.preferredDate} onChange={(event) => update('preferredDate', event.target.value)} />
        </Field>
        <Field label="Alternative date" htmlFor="alternativeDate" error={errors.alternativeDate}>
          <input id="alternativeDate" type="date" className={inputClass} value={values.alternativeDate} onChange={(event) => update('alternativeDate', event.target.value)} />
        </Field>
        <Field label="Preferred time" htmlFor="preferredTime" error={errors.preferredTime}>
          <input id="preferredTime" type="time" className={inputClass} value={values.preferredTime} onChange={(event) => update('preferredTime', event.target.value)} />
        </Field>
        <Field label="Match type" htmlFor="matchType" error={errors.matchType}>
          <select id="matchType" className={inputClass} value={values.matchType} onChange={(event) => update('matchType', event.target.value)}>
            {MATCH_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label="Proposed venue" htmlFor="venue" error={errors.venue}>
          <input id="venue" className={inputClass} value={values.venue} onChange={(event) => update('venue', event.target.value)} />
        </Field>
        <Field label="Home or away preference" htmlFor="homeAway" error={errors.homeAway}>
          <select id="homeAway" className={inputClass} value={values.homeAway} onChange={(event) => update('homeAway', event.target.value)}>
            {['Home', 'Away', 'Either'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-5">
        <Field label="Additional message" htmlFor="message">
          <textarea id="message" rows="4" className={inputClass} value={values.message} onChange={(event) => update('message', event.target.value)} />
        </Field>
      </div>
      {errors.form && <p className="mt-4 text-sm text-flare">{errors.form}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className="rounded-full bg-flare px-5 py-3 text-sm font-semibold text-on-flare" onClick={() => prepare('whatsapp')}>
          Send Request via WhatsApp
        </button>
        <button type="button" className="rounded-full border border-line px-5 py-3 text-sm font-semibold" onClick={() => prepare('email')}>
          Send Request via Email
        </button>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted">
        Neither button delivers the request by itself. It opens WhatsApp or your email app with the details filled in. You still have to press Send.
      </p>
      {prepared && (
        <div className="mt-6 rounded-3xl border border-flare/40 bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-flare">Ready to send · {prepared.reference}</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Your {channelLabel} should be open with this draft. {settings.shortName} has not received it until you press Send there.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink" href={prepared.href} target="_blank" rel="noreferrer">
              Open {channelLabel} again
            </a>
            <button type="button" className="rounded-full border border-line px-4 py-2 text-sm font-semibold" onClick={copyMessage}>
              Copy message
            </button>
          </div>
          {copyNote && <p className="mt-3 text-sm text-muted">{copyNote}</p>}
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-surface p-4 text-xs leading-5 text-muted">{prepared.message}</pre>
        </div>
      )}
    </form>
  )
}
