export function buildRequestMessage(values, reference, clubName) {
  return [
    `${clubName} match request ${reference}`,
    `Requesting team: ${values.teamName}`,
    `Contact: ${values.contactName}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Preferred date: ${values.preferredDate}`,
    `Alternative date: ${values.alternativeDate || 'None'}`,
    `Preferred time: ${values.preferredTime}`,
    `Proposed venue: ${values.venue}`,
    `Match type: ${values.matchType}`,
    `Home or away preference: ${values.homeAway}`,
    `Preferred contact method: ${values.contactMethod}`,
    `Message: ${values.message.trim() || 'None'}`,
    '',
    'This message was prepared by the club website. It is not delivered until you press Send.',
  ].join('\n')
}

export function whatsappUrl(number, message) {
  const digits = String(number || '').replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function mailtoUrl(email, subject, body) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function validateRequest(values) {
  const errors = {}
  if (!values.teamName.trim()) errors.teamName = 'Enter the requesting team name.'
  if (!values.contactName.trim()) errors.contactName = 'Enter the contact person’s full name.'
  const digits = values.phone.replace(/\D/g, '')
  if (!values.phone.trim().startsWith('+') || digits.length < 8 || digits.length > 15) {
    errors.phone = 'Enter a phone number with a country code, for example +254 712 345 678.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.preferredDate) errors.preferredDate = 'Choose a preferred match date.'
  if (values.alternativeDate && values.alternativeDate === values.preferredDate) {
    errors.alternativeDate = 'Use a different alternative date, or leave it blank.'
  }
  if (!values.preferredTime) errors.preferredTime = 'Choose a preferred time.'
  if (!values.venue.trim()) errors.venue = 'Enter a proposed venue.'
  if (!values.matchType) errors.matchType = 'Choose a match type.'
  if (!values.homeAway) errors.homeAway = 'Choose a home or away preference.'
  if (!values.contactMethod) errors.contactMethod = 'Choose a preferred contact method.'
  return errors
}

export function validatePlayer(player, players) {
  const errors = {}
  if (!player.name.trim()) errors.name = 'Enter the player’s full name.'
  const number = Number(player.number)
  if (!Number.isInteger(number) || number < 0 || number > 99) {
    errors.number = 'Enter a jersey number from 0 to 99.'
  } else if (
    players.some(
      (item) => item.id !== player.id && Number(item.number) === number && item.status !== 'inactive',
    ) &&
    player.status !== 'inactive'
  ) {
    errors.number = 'Another active player already uses this jersey number.'
  }
  if (!player.position) errors.position = 'Choose a position.'
  if (player.height !== '' && (!Number.isInteger(Number(player.height)) || Number(player.height) < 120)) {
    errors.height = 'Enter height in centimetres, or leave it blank.'
  }
  if (player.age !== '' && (!Number.isInteger(Number(player.age)) || Number(player.age) < 10)) {
    errors.age = 'Enter a whole-number age, or leave it blank.'
  }
  return errors
}

export function validateMatch(match) {
  const errors = {}
  if (!match.opponent.trim()) errors.opponent = 'Enter the opponent name.'
  if (!match.date) errors.date = 'Choose a match date.'
  if (!match.time) errors.time = 'Choose a start time.'
  if (!match.venue.trim()) errors.venue = 'Enter the venue.'
  if (!match.competition.trim()) errors.competition = 'Enter the competition name.'
  if (!match.matchType) errors.matchType = 'Choose a match type.'
  if (match.status === 'completed') {
    const decisive = (match.sets || []).some((set) => {
      const home = set.home === '' ? null : Number(set.home)
      const away = set.away === '' ? null : Number(set.away)
      return Number.isInteger(home) && Number.isInteger(away) && home !== away
    })
    if (!decisive) errors.sets = 'Enter set scores so one side has won more sets.'
  }
  return errors
}

export function validateGallery(item) {
  const errors = {}
  if (!item.caption.trim()) errors.caption = 'Enter a caption.'
  if (!item.date) errors.date = 'Choose a date.'
  if (!item.category) errors.category = 'Choose a category.'
  if (item.type === 'youtube') {
    if (!item.youtubeId) errors.youtubeId = 'Paste a YouTube link or an 11-character video id.'
  } else if (!item.src.trim()) {
    errors.src = 'Upload a file or enter a project path such as /images/gallery/photo.jpg.'
  }
  return errors
}
