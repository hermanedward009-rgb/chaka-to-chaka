import assert from 'node:assert/strict'
import test from 'node:test'
import { mailtoUrl, whatsappUrl } from './forms.js'

test('whatsapp link uses digits only and encodes the message', () => {
  const url = whatsappUrl('+254 700 000 000', 'Hello rally')
  assert.equal(url, 'https://wa.me/254700000000?text=Hello%20rally')
})

test('mailto link keeps the address and encodes the subject', () => {
  const url = mailtoUrl('club@example.com', 'Match request', 'Line one')
  assert.equal(url, 'mailto:club@example.com?subject=Match%20request&body=Line%20one')
})
