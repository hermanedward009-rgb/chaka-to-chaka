import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import PlayerCard from '../components/PlayerCard.jsx'
import PlayerProfileModal from '../components/PlayerProfileModal.jsx'
import { POSITIONS } from '../data/constants.js'
import { useClubData } from '../hooks/useClubData.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { filterPlayers, sortPlayers } from '../utils/statistics.js'
import { inputClass } from '../utils/ui.js'

export default function SquadPage() {
  const { players } = useClubData()
  const [query, setQuery] = useState('')
  const [position, setPosition] = useState('all')
  const [sort, setSort] = useState('number-asc')
  const [selected, setSelected] = useState(null)
  usePageTitle('Squad')

  const visible = useMemo(
    () => sortPlayers(filterPlayers(players, { query, position }), sort),
    [players, query, position, sort],
  )

  return (
    <div className="pb-16">
      <PageHeader eyebrow="Roster" title="The squad">
        <p>The Chaka to Chaka roster, from setters to liberos.</p>
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <input
          className={inputClass}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name or jersey number"
          aria-label="Search players"
        />
        <select className={inputClass} value={position} aria-label="Filter by position" onChange={(event) => setPosition(event.target.value)}>
          <option value="all">All positions</option>
          {POSITIONS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select className={inputClass} value={sort} aria-label="Sort players" onChange={(event) => setSort(event.target.value)}>
          <option value="number-asc">Jersey number, low to high</option>
          <option value="number-desc">Jersey number, high to low</option>
          <option value="name-asc">Name, A to Z</option>
          <option value="name-desc">Name, Z to A</option>
          <option value="position">Position</option>
          <option value="height">Height</option>
          <option value="age">Age</option>
        </select>
      </div>
      <p className="mx-auto max-w-7xl px-4 pb-4 text-sm text-muted">
        {visible.length} {visible.length === 1 ? 'player' : 'players'}
      </p>
      <div className="mx-auto max-w-7xl px-4">
        {visible.length === 0 ? (
          <EmptyState title="No players found">Try another name, number, or position.</EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((player) => (
              <PlayerCard key={player.id} player={player} onOpen={setSelected} />
            ))}
          </div>
        )}
      </div>
      <PlayerProfileModal player={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
