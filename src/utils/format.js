export function formatDate(iso) {
  if (!iso) return 'Date to be confirmed'
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatTime(time) {
  if (!time) return 'Time to be confirmed'
  const [hourText, minuteText] = String(time).split(':')
  const hour = Number(hourText)
  const minute = Number(minuteText)
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return time
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`
}

export function formatPercent(value) {
  const number = Number(value) || 0
  const text = Number.isInteger(number) ? String(number) : number.toFixed(1)
  return `${text}%`
}

export function titleCaseStatus(status) {
  if (!status) return ''
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function initials(name) {
  return String(name || 'Player')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
}
