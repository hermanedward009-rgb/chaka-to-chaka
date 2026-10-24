import { MATCH_FORMATS } from '../data/constants.js'

export function parseScore(value) {
  if (value === '' || value === null || value === undefined) return null
  if (typeof value === 'string' && value.trim() === '') return null
  const number = typeof value === 'number' ? value : Number(String(value).trim())
  if (!Number.isInteger(number) || number < 0) return null
  return number
}

export function evaluateSets(sets = []) {
  let homeSets = 0
  let awaySets = 0
  let homePoints = 0
  let awayPoints = 0
  const playedSets = []

  for (const set of sets) {
    const home = parseScore(set?.home)
    const away = parseScore(set?.away)
    if (home === null || away === null) continue
    homePoints += home
    awayPoints += away
    if (home > away) homeSets += 1
    else if (away > home) awaySets += 1
    playedSets.push({ home, away })
  }

  let setWinner = null
  if (homeSets > awaySets) setWinner = 'home'
  else if (awaySets > homeSets) setWinner = 'away'

  return { homeSets, awaySets, homePoints, awayPoints, setWinner, playedSets }
}

export function clubOutcome(match) {
  const summary = evaluateSets(match?.sets)
  const side = match?.clubSide === 'away' ? 'away' : 'home'
  const clubSets = side === 'home' ? summary.homeSets : summary.awaySets
  const opponentSets = side === 'home' ? summary.awaySets : summary.homeSets
  const clubPoints = side === 'home' ? summary.homePoints : summary.awayPoints
  const opponentPoints = side === 'home' ? summary.awayPoints : summary.homePoints

  let outcome = null
  if (match?.status === 'completed') {
    if (summary.setWinner === side) outcome = 'win'
    else if (summary.setWinner && summary.setWinner !== side) outcome = 'loss'
  }

  return {
    ...summary,
    clubSets,
    opponentSets,
    clubPoints,
    opponentPoints,
    outcome,
    counts: outcome === 'win' || outcome === 'loss',
  }
}

export function formatLabel(format) {
  return MATCH_FORMATS[format]?.label || 'Best of 5'
}

export function setsTarget(format) {
  return MATCH_FORMATS[format]?.setsToWin || 3
}

export function computeStatistics(matches = [], players = []) {
  const dated = [...matches]
    .filter((match) => match?.status === 'completed')
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))

  let wins = 0
  let losses = 0
  let setsWon = 0
  let setsLost = 0
  let pointsFor = 0
  let pointsAgainst = 0
  const performance = []

  for (const match of dated) {
    const result = clubOutcome(match)
    if (!result.counts) continue
    if (result.outcome === 'win') wins += 1
    if (result.outcome === 'loss') losses += 1
    setsWon += result.clubSets
    setsLost += result.opponentSets
    pointsFor += result.clubPoints
    pointsAgainst += result.opponentPoints
    performance.push({
      id: match.id,
      opponent: match.opponent || 'Opponent',
      date: match.date,
      outcome: result.outcome,
      clubSets: result.clubSets,
      opponentSets: result.opponentSets,
      clubPoints: result.clubPoints,
      opponentPoints: result.opponentPoints,
    })
  }

  const played = wins + losses
  const winPercentage = played === 0 ? 0 : Math.round((wins / played) * 1000) / 10

  return {
    totalPlayers: players.length,
    activePlayers: players.filter((player) => player.status !== 'inactive').length,
    played,
    wins,
    losses,
    winPercentage,
    setsWon,
    setsLost,
    pointsFor,
    pointsAgainst,
    performance,
  }
}

export function resolveSides(match, settings) {
  const club = {
    name: settings?.shortName || settings?.name || 'Chaka to Chaka',
    fullName: settings?.name || 'Chaka to Chaka Volleyball Club',
    logo: settings?.logo || '/images/logo.svg',
  }
  const opponent = {
    name: match?.opponent || 'Opponent',
    fullName: match?.opponent || 'Opponent',
    logo: match?.opponentLogo || '/images/teams/default.svg',
  }
  if (match?.clubSide === 'away') return { home: opponent, away: club }
  return { home: club, away: opponent }
}

export function sortPlayers(players, sort) {
  const list = [...players]
  const byName = (a, b) => a.name.localeCompare(b.name)
  switch (sort) {
    case 'name-desc':
      return list.sort((a, b) => byName(b, a))
    case 'number-asc':
      return list.sort((a, b) => Number(a.number) - Number(b.number) || byName(a, b))
    case 'number-desc':
      return list.sort((a, b) => Number(b.number) - Number(a.number) || byName(a, b))
    case 'age':
      return list.sort((a, b) => (Number(b.age) || 0) - (Number(a.age) || 0) || byName(a, b))
    case 'height':
      return list.sort((a, b) => (Number(b.height) || 0) - (Number(a.height) || 0) || byName(a, b))
    case 'position':
      return list.sort((a, b) => a.position.localeCompare(b.position) || byName(a, b))
    default:
      return list.sort(byName)
  }
}

export function filterPlayers(players, { query = '', position = 'all' } = {}) {
  const needle = query.trim().toLowerCase()
  return players.filter((player) => {
    if (position !== 'all' && player.position !== position) return false
    if (!needle) return true
    return (
      player.name.toLowerCase().includes(needle) || String(player.number).includes(needle)
    )
  })
}
