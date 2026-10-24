import { defaultSettings } from '../data/clubSettings.js'
import {
  GALLERY_CATEGORIES,
  MATCH_FORMATS,
  MATCH_STATUSES,
  MATCH_TYPES,
  POSITIONS,
} from '../data/constants.js'

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function cleanPlayer(player, index) {
  const errors = []
  if (!player || typeof player !== 'object' || Array.isArray(player)) {
    return { errors: [`Player ${index + 1} must be an object.`] }
  }
  const name = text(player.name)
  if (!name) errors.push(`Player ${index + 1} needs a name.`)
  const number = Number(player.number)
  if (!Number.isInteger(number) || number < 0 || number > 99) {
    errors.push(`Player ${index + 1} needs a jersey number from 0 to 99.`)
  }
  if (!POSITIONS.includes(player.position)) {
    errors.push(`Player ${index + 1} has an unknown position.`)
  }
  if (player.status && !['active', 'inactive'].includes(player.status)) {
    errors.push(`Player ${index + 1} status must be active or inactive.`)
  }
  const height = player.height === '' || player.height == null ? '' : Number(player.height)
  const age = player.age === '' || player.age == null ? '' : Number(player.age)
  if (height !== '' && (!Number.isInteger(height) || height < 120 || height > 240)) {
    errors.push(`Player ${index + 1} height must be a whole number of centimetres.`)
  }
  if (age !== '' && (!Number.isInteger(age) || age < 10 || age > 80)) {
    errors.push(`Player ${index + 1} age must be a whole number.`)
  }
  if (errors.length) return { errors }
  return {
    value: {
      id: text(player.id) || `player-import-${index + 1}`,
      name,
      photo: text(player.photo),
      number,
      position: player.position,
      height,
      age,
      nationality: text(player.nationality),
      biography: text(player.biography),
      previousClub: text(player.previousClub),
      status: player.status === 'inactive' ? 'inactive' : 'active',
      featured: Boolean(player.featured),
    },
  }
}

function cleanSets(sets, label) {
  if (!Array.isArray(sets)) return { errors: [`${label} sets must be a list.`] }
  const errors = []
  const value = []
  sets.forEach((set, index) => {
    const home = set?.home === '' || set?.home == null ? '' : Number(set.home)
    const away = set?.away === '' || set?.away == null ? '' : Number(set.away)
    const homeOk = home === '' || (Number.isInteger(home) && home >= 0)
    const awayOk = away === '' || (Number.isInteger(away) && away >= 0)
    if (!homeOk || !awayOk) errors.push(`${label} set ${index + 1} needs whole-number scores.`)
    else value.push({ home, away })
  })
  return errors.length ? { errors } : { value }
}

function cleanMatch(match, index) {
  const label = `Match ${index + 1}`
  if (!match || typeof match !== 'object' || Array.isArray(match)) {
    return { errors: [`${label} must be an object.`] }
  }
  const errors = []
  if (!text(match.opponent)) errors.push(`${label} needs an opponent.`)
  if (!text(match.date)) errors.push(`${label} needs a date.`)
  if (!text(match.venue)) errors.push(`${label} needs a venue.`)
  if (!text(match.competition)) errors.push(`${label} needs a competition.`)
  if (!MATCH_TYPES.includes(match.matchType)) errors.push(`${label} has an unknown match type.`)
  if (!MATCH_STATUSES.includes(match.status)) errors.push(`${label} has an unknown status.`)
  if (!MATCH_FORMATS[match.format]) errors.push(`${label} has an unknown format.`)
  if (match.clubSide && !['home', 'away'].includes(match.clubSide)) {
    errors.push(`${label} club side must be home or away.`)
  }
  const sets = cleanSets(match.sets || [], label)
  if (sets.errors) errors.push(...sets.errors)
  if (errors.length) return { errors }
  return {
    value: {
      id: text(match.id) || `match-import-${index + 1}`,
      opponent: text(match.opponent),
      opponentLogo: text(match.opponentLogo),
      clubSide: match.clubSide === 'away' ? 'away' : 'home',
      date: text(match.date),
      time: text(match.time),
      venue: text(match.venue),
      competition: text(match.competition),
      matchType: match.matchType,
      format: match.format,
      status: match.status,
      sets: sets.value,
    },
  }
}

function cleanGallery(item, index) {
  const label = `Gallery item ${index + 1}`
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    return { errors: [`${label} must be an object.`] }
  }
  const errors = []
  if (!['image', 'video', 'youtube'].includes(item.type)) errors.push(`${label} has an unknown media type.`)
  if (!GALLERY_CATEGORIES.includes(item.category)) errors.push(`${label} has an unknown category.`)
  if (!text(item.caption)) errors.push(`${label} needs a caption.`)
  if (!text(item.date)) errors.push(`${label} needs a date.`)
  if (item.type === 'youtube' && item.youtubeId && !/^[\w-]{11}$/.test(text(item.youtubeId))) {
    errors.push(`${label} YouTube id must be 11 characters, or left blank.`)
  }
  if (errors.length) return { errors }
  return {
    value: {
      id: text(item.id) || `gallery-import-${index + 1}`,
      type: item.type,
      src: text(item.src),
      youtubeId: text(item.youtubeId),
      poster: text(item.poster),
      category: item.category,
      caption: text(item.caption),
      alt: text(item.alt) || text(item.caption),
      date: text(item.date),
    },
  }
}

function cleanAnnouncement(item, index) {
  if (!item || typeof item !== 'object') return { errors: [`Announcement ${index + 1} is invalid.`] }
  if (!text(item.title) || !text(item.body)) {
    return { errors: [`Announcement ${index + 1} needs a title and body.`] }
  }
  return {
    value: {
      id: text(item.id) || `announcement-import-${index + 1}`,
      title: text(item.title),
      date: text(item.date),
      body: text(item.body),
    },
  }
}

export function validateClubExport(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, errors: ['The file must contain a JSON object.'] }
  }
  const errors = []
  if (!Array.isArray(data.players)) errors.push('players must be an array.')
  if (!Array.isArray(data.matches)) errors.push('matches must be an array.')
  if (!Array.isArray(data.gallery)) errors.push('gallery must be an array.')
  if (!data.settings || typeof data.settings !== 'object' || Array.isArray(data.settings)) {
    errors.push('settings must be an object.')
  } else if (!text(data.settings.name)) errors.push('settings.name is required.')
  if (data.requests != null && !Array.isArray(data.requests)) errors.push('requests must be an array.')
  if (errors.length) return { ok: false, errors }

  const players = []
  data.players.forEach((player, index) => {
    const result = cleanPlayer(player, index)
    if (result.errors) errors.push(...result.errors)
    else players.push(result.value)
  })
  const matches = []
  data.matches.forEach((match, index) => {
    const result = cleanMatch(match, index)
    if (result.errors) errors.push(...result.errors)
    else matches.push(result.value)
  })
  const gallery = []
  data.gallery.forEach((item, index) => {
    const result = cleanGallery(item, index)
    if (result.errors) errors.push(...result.errors)
    else gallery.push(result.value)
  })

  const announcements = []
  const incomingAnnouncements = Array.isArray(data.settings.announcements)
    ? data.settings.announcements
    : defaultSettings.announcements
  incomingAnnouncements.forEach((item, index) => {
    const result = cleanAnnouncement(item, index)
    if (result.errors) errors.push(...result.errors)
    else announcements.push(result.value)
  })

  if (errors.length) return { ok: false, errors }

  const socials = {
    ...defaultSettings.socials,
    ...(data.settings.socials && typeof data.settings.socials === 'object' ? data.settings.socials : {}),
  }
  for (const key of Object.keys(socials)) socials[key] = text(socials[key])

  return {
    ok: true,
    errors: [],
    value: {
      version: 1,
      settings: {
        ...defaultSettings,
        ...data.settings,
        name: text(data.settings.name),
        shortName: text(data.settings.shortName) || text(data.settings.name),
        tagline: text(data.settings.tagline),
        description: text(data.settings.description),
        founded: text(data.settings.founded),
        location: text(data.settings.location),
        venue: text(data.settings.venue),
        email: text(data.settings.email),
        whatsapp: text(data.settings.whatsapp).replace(/\D/g, ''),
        phoneDisplay: text(data.settings.phoneDisplay),
        logo:
          !text(data.settings.logo) || text(data.settings.logo) === '/images/logo.svg'
            ? defaultSettings.logo
            : text(data.settings.logo),
        heroImage: text(data.settings.heroImage) || defaultSettings.heroImage,
        socials,
        announcements,
      },
      players,
      matches,
      gallery,
      requests: Array.isArray(data.requests)
        ? data.requests.filter((item) => item && typeof item === 'object')
        : [],
    },
  }
}
