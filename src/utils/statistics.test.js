import assert from 'node:assert/strict'
import test from 'node:test'
import { sampleMatches } from '../data/matches.js'
import { samplePlayers } from '../data/players.js'
import { clubOutcome, computeStatistics, evaluateSets } from './statistics.js'

test('winner is decided by sets won, not total points', () => {
  const summary = evaluateSets([
    { home: 25, away: 23 },
    { home: 25, away: 23 },
    { home: 10, away: 25 },
  ])
  assert.equal(summary.homeSets, 2)
  assert.equal(summary.awaySets, 1)
  assert.equal(summary.setWinner, 'home')
  assert.ok(summary.homePoints < summary.awayPoints)
})

test('tied sets do not award a set win', () => {
  const summary = evaluateSets([
    { home: 25, away: 25 },
    { home: '', away: 20 },
    { home: 'x', away: 10 },
  ])
  assert.equal(summary.homeSets, 0)
  assert.equal(summary.awaySets, 0)
  assert.equal(summary.setWinner, null)
  assert.equal(summary.playedSets.length, 1)
  assert.equal(summary.homePoints, 25)
})

test('away club result follows the club side', () => {
  const result = clubOutcome({
    status: 'completed',
    clubSide: 'away',
    sets: [{ home: 25, away: 10 }],
  })
  assert.equal(result.outcome, 'loss')
  assert.equal(result.clubSets, 0)
  assert.equal(result.opponentSets, 1)
  assert.equal(result.clubPoints, 10)
})

test('only decisive completed matches count', () => {
  const matches = [
    { id: 'w', status: 'completed', clubSide: 'home', opponent: 'A', date: '2026-01-01', sets: [{ home: 25, away: 10 }] },
    { id: 'p', status: 'postponed', clubSide: 'home', opponent: 'B', date: '2026-01-02', sets: [{ home: 25, away: 10 }] },
    { id: 'c', status: 'cancelled', clubSide: 'home', opponent: 'C', date: '2026-01-03', sets: [{ home: 25, away: 10 }] },
    { id: 'u', status: 'upcoming', clubSide: 'home', opponent: 'D', date: '2026-01-04', sets: [] },
    { id: 't', status: 'completed', clubSide: 'home', opponent: 'E', date: '2026-01-05', sets: [{ home: 20, away: 20 }] },
  ]
  const stats = computeStatistics(matches, [{ status: 'active' }, { status: 'inactive' }])
  assert.equal(stats.played, 1)
  assert.equal(stats.wins, 1)
  assert.equal(stats.losses, 0)
  assert.equal(stats.winPercentage, 100)
  assert.equal(stats.totalPlayers, 2)
  assert.equal(stats.activePlayers, 1)
})

test('sample season record', () => {
  const stats = computeStatistics(sampleMatches, samplePlayers)
  assert.equal(stats.wins, 4)
  assert.equal(stats.losses, 2)
  assert.equal(stats.played, 6)
  assert.equal(stats.winPercentage, 66.7)
  assert.equal(stats.setsWon, 15)
  assert.equal(stats.setsLost, 10)
  assert.equal(stats.pointsFor, 568)
  assert.equal(stats.pointsAgainst, 533)
  assert.equal(stats.totalPlayers, 12)
  assert.equal(stats.activePlayers, 10)
  assert.equal(stats.performance[0].outcome, 'win')
  assert.equal(stats.performance.at(-1).opponent, 'Metro Rally')
})
