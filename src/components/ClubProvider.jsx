import { useRef, useState } from 'react'
import { defaultClubState } from '../data/defaults.js'
import { ClubContext } from '../hooks/useClubData.js'
import { loadClubState, saveClubState } from '../utils/storage.js'

export default function ClubProvider({ children }) {
  const [state, setState] = useState(() => loadClubState())
  const [storageWarning, setStorageWarning] = useState('')
  const stateRef = useRef(state)

  function commit(recipe) {
    const next = recipe(stateRef.current)
    stateRef.current = next
    const result = saveClubState(next)
    setStorageWarning(result.ok ? '' : result.error)
    setState(next)
  }

  const value = {
    ...state,
    storageWarning,
    updateSettings: (patch) =>
      commit((current) => ({
        ...current,
        settings: { ...current.settings, ...patch },
      })),
    savePlayer: (player) =>
      commit((current) => ({
        ...current,
        players: current.players.some((item) => item.id === player.id)
          ? current.players.map((item) => (item.id === player.id ? player : item))
          : [...current.players, player],
      })),
    deletePlayer: (id) =>
      commit((current) => ({
        ...current,
        players: current.players.filter((player) => player.id !== id),
      })),
    saveMatch: (match) =>
      commit((current) => ({
        ...current,
        matches: current.matches.some((item) => item.id === match.id)
          ? current.matches.map((item) => (item.id === match.id ? match : item))
          : [...current.matches, match],
      })),
    deleteMatch: (id) =>
      commit((current) => ({
        ...current,
        matches: current.matches.filter((match) => match.id !== id),
      })),
    saveGalleryItem: (item) =>
      commit((current) => ({
        ...current,
        gallery: current.gallery.some((entry) => entry.id === item.id)
          ? current.gallery.map((entry) => (entry.id === item.id ? item : entry))
          : [...current.gallery, item],
      })),
    deleteGalleryItem: (id) =>
      commit((current) => ({
        ...current,
        gallery: current.gallery.filter((item) => item.id !== id),
      })),
    addRequest: (request) =>
      commit((current) => ({
        ...current,
        requests: [request, ...current.requests].slice(0, 50),
      })),
    deleteRequest: (id) =>
      commit((current) => ({
        ...current,
        requests: current.requests.filter((request) => request.id !== id),
      })),
    replaceState: (next) => commit(() => next),
    resetSampleData: () => commit(() => defaultClubState()),
  }

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>
}
