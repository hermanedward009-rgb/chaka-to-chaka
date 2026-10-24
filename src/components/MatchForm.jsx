import { useMemo, useState } from 'react'
import { MATCH_FORMATS, MATCH_TYPES } from '../data/constants.js'
import { useClubData } from '../hooks/useClubData.js'
import { validateMatch } from '../utils/forms.js'
import { readFileAsDataUrl } from '../utils/media.js'
import { clubOutcome, evaluateSets } from '../utils/statistics.js'
import { ghostButton, inputClass, primaryButton } from '../utils/ui.js'
import Field from './Field.jsx'

export default function MatchForm({ match, onSave, onCancel }) {
  const { settings } = useClubData()
  const [form, setForm] = useState(match)
  const [errors, setErrors] = useState({})
  const [logoError, setLogoError] = useState('')

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function updateSet(index, side, value) {
    setForm((current) => ({
      ...current,
      sets: current.sets.map((set, setIndex) => (setIndex === index ? { ...set, [side]: value } : set)),
    }))
  }

  const maxSets = MATCH_FORMATS[form.format]?.maxSets || 5
  const preview = useMemo(() => {
    const sets = form.sets
      .map((set) => ({ home: set.home === '' ? '' : Number(set.home), away: set.away === '' ? '' : Number(set.away) }))
      .filter((set) => Number.isInteger(set.home) && Number.isInteger(set.away))
    return { sets: evaluateSets(sets), outcome: clubOutcome({ ...form, status: 'completed', sets }) }
  }, [form])

  async function onLogo(event) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      update('opponentLogo', await readFileAsDataUrl(file, 400_000))
      setLogoError('')
    } catch (error) {
      setLogoError(error.message)
    }
  }

  function onSubmit(event) {
    event.preventDefault()
    const sets = []
    let setError = ''
    form.sets.forEach((set, index) => {
      if (set.home === '' && set.away === '') return
      const home = Number(set.home)
      const away = Number(set.away)
      if (!Number.isInteger(home) || !Number.isInteger(away) || home < 0 || away < 0) {
        setError = `Set ${index + 1} needs two whole-number scores.`
      } else sets.push({ home, away })
    })
    const next = {
      ...form,
      opponent: form.opponent.trim(),
      venue: form.venue.trim(),
      competition: form.competition.trim(),
      sets,
    }
    const nextErrors = validateMatch(next)
    if (setError) nextErrors.sets = setError
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) onSave(next)
  }

  const homeLabel = form.clubSide === 'away' ? form.opponent || 'Opponent' : settings.shortName
  const awayLabel = form.clubSide === 'away' ? settings.shortName : form.opponent || 'Opponent'

  return (
    <form className="rounded-3xl border border-line bg-surface p-5" onSubmit={onSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Opponent" htmlFor="opponent" error={errors.opponent}>
          <input id="opponent" className={inputClass} value={form.opponent} onChange={(event) => update('opponent', event.target.value)} />
        </Field>
        <Field label="Club side" htmlFor="club-side">
          <select id="club-side" className={inputClass} value={form.clubSide} onChange={(event) => update('clubSide', event.target.value)}>
            <option value="home">Home</option>
            <option value="away">Away</option>
          </select>
        </Field>
        <Field label="Date" htmlFor="match-date" error={errors.date}>
          <input id="match-date" type="date" className={inputClass} value={form.date} onChange={(event) => update('date', event.target.value)} />
        </Field>
        <Field label="Time" htmlFor="match-time" error={errors.time}>
          <input id="match-time" type="time" className={inputClass} value={form.time} onChange={(event) => update('time', event.target.value)} />
        </Field>
        <Field label="Venue" htmlFor="match-venue" error={errors.venue}>
          <input id="match-venue" className={inputClass} value={form.venue} onChange={(event) => update('venue', event.target.value)} />
        </Field>
        <Field label="Competition" htmlFor="competition" error={errors.competition}>
          <input id="competition" className={inputClass} value={form.competition} onChange={(event) => update('competition', event.target.value)} />
        </Field>
        <Field label="Match type" htmlFor="match-type" error={errors.matchType}>
          <select id="match-type" className={inputClass} value={form.matchType} onChange={(event) => update('matchType', event.target.value)}>
            {MATCH_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label="Format" htmlFor="format" hint={MATCH_FORMATS[form.format]?.label}>
          <select id="format" className={inputClass} value={form.format} onChange={(event) => update('format', event.target.value)}>
            {Object.entries(MATCH_FORMATS).map(([value, format]) => (
              <option key={value} value={value}>{format.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Status" htmlFor="status">
          <select id="status" className={inputClass} value={form.status} onChange={(event) => update('status', event.target.value)}>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="postponed">Postponed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>
        <Field label="Opponent logo path" htmlFor="opponent-logo" hint="Example: /images/teams/harbor.svg">
          <input
            id="opponent-logo"
            className={inputClass}
            value={form.opponentLogo.startsWith('data:') ? '' : form.opponentLogo}
            placeholder="/images/teams/opponent.svg"
            onChange={(event) => update('opponentLogo', event.target.value)}
          />
        </Field>
        <Field label="Or upload an opponent logo" htmlFor="opponent-file" error={logoError}>
          <input id="opponent-file" className={inputClass} type="file" accept="image/*" onChange={onLogo} />
        </Field>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-display text-3xl uppercase">Set scores</h3>
          <button
            type="button"
            className={ghostButton}
            disabled={form.sets.length >= maxSets}
            onClick={() => update('sets', [...form.sets, { home: '', away: '' }])}
          >
            Add set
          </button>
        </div>
        <p className="mb-3 text-sm text-muted">
          Home is {homeLabel}. Away is {awayLabel}. The winner is whoever takes more sets, not whoever scores more points.
          {form.format === 'best-of-5' ? ' Best of five means first to three sets.' : ''}
          {form.format === 'best-of-3' ? ' Best of three means first to two sets.' : ''}
        </p>
        <div className="space-y-3">
          {form.sets.map((set, index) => (
            <div key={`${form.id}-set-${index}`} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2">
              <span className="text-sm text-muted">Set {index + 1}</span>
              <input aria-label={`Set ${index + 1} home score`} className={inputClass} inputMode="numeric" value={set.home} onChange={(event) => updateSet(index, 'home', event.target.value)} />
              <input aria-label={`Set ${index + 1} away score`} className={inputClass} inputMode="numeric" value={set.away} onChange={(event) => updateSet(index, 'away', event.target.value)} />
              <button type="button" className="text-sm text-flare" onClick={() => update('sets', form.sets.filter((_, setIndex) => setIndex !== index))}>
                Remove
              </button>
            </div>
          ))}
        </div>
        {errors.sets && <p className="mt-2 text-sm text-flare">{errors.sets}</p>}
        <p className="mt-4 text-sm text-muted">
          Preview: sets {preview.sets.homeSets}–{preview.sets.awaySets}
          {preview.outcome.outcome ? `, club ${preview.outcome.outcome}` : ', no club result yet'}.
          Points {preview.outcome.clubPoints}–{preview.outcome.opponentPoints} do not decide the match.
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="submit" className={primaryButton}>Save match</button>
        <button type="button" className={ghostButton} onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}
