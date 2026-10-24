import { defaultSettings } from './clubSettings.js'
import { sampleGallery } from './gallery.js'
import { sampleMatches } from './matches.js'
import { samplePlayers } from './players.js'

export function defaultClubState() {
  return {
    version: 1,
    settings: structuredClone(defaultSettings),
    players: structuredClone(samplePlayers),
    matches: structuredClone(sampleMatches),
    gallery: structuredClone(sampleGallery),
    requests: [],
  }
}
