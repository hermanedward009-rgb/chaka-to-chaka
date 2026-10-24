import assert from 'node:assert/strict'
import test from 'node:test'
import { defaultClubState } from '../data/defaults.js'
import { validateClubExport } from './validate.js'

test('sample state passes import validation', () => {
  const result = validateClubExport(defaultClubState())
  assert.equal(result.ok, true)
  assert.equal(result.value.players.length, 12)
  assert.equal(result.value.matches.length, 11)
})

test('import rejects an unknown position and keeps the existing data untouched', () => {
  const data = defaultClubState()
  data.players[0].position = 'Coach'
  const result = validateClubExport(data)
  assert.equal(result.ok, false)
  assert.ok(result.errors.some((error) => error.includes('unknown position')))
})

test('import rejects a file that is not an object', () => {
  const result = validateClubExport([])
  assert.equal(result.ok, false)
})
