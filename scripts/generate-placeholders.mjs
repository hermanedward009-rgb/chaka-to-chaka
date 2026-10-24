import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

function write(path, contents) {
  const file = join(root, path)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, contents)
}

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-label="Chaka to Chaka">
  <rect width="80" height="80" rx="18" fill="#070707"/>
  <rect x="3" y="3" width="74" height="74" rx="16" fill="none" stroke="#3ec6ff" stroke-width="2"/>
  <circle cx="40" cy="40" r="22" fill="none" stroke="#f4f1ea" stroke-width="2.4"/>
  <path d="M18 40h44M40 18c7 7.2 7 36.8 0 44M40 18c-7 7.2-7 36.8 0 44" fill="none" stroke="#3ec6ff" stroke-width="2"/>
</svg>`

write('favicon.svg', logo)
write('images/logo.svg', logo)

write(
  'images/hero.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" role="img" aria-label="Chaka to Chaka on court">
    <rect width="1600" height="1000" fill="#101010"/>
    <g opacity="0.35" stroke="#f4f1ea" fill="none" stroke-width="2">
      <path d="M180 860 L520 430 L1080 430 L1420 860"/>
      <path d="M520 430 H1080"/>
      <path d="M700 430 L760 860 M900 430 L840 860"/>
      <path d="M800 250 V430"/>
    </g>
    <circle cx="1040" cy="360" r="150" fill="#070707" stroke="#3ec6ff" stroke-width="14"/>
    <path d="M890 360h300M1040 210c48 48 48 204 0 300M1040 210c-48 48-48 204 0 300" fill="none" stroke="#f4f1ea" stroke-width="10"/>
    <text x="90" y="760" font-family="Arial Black, Arial, sans-serif" font-size="92" fill="#f4f1ea">CHAKA</text>
    <text x="90" y="850" font-family="Arial Black, Arial, sans-serif" font-size="92" fill="#3ec6ff">TO CHAKA</text>
  </svg>`,
)

const players = [
  ['player-01', 'LO', '7', '#3ec6ff'],
  ['player-02', 'MA', '12', '#f4f1ea'],
  ['player-03', 'SM', '18', '#5eb6ff'],
  ['player-04', 'EN', '9', '#3ec6ff'],
  ['player-05', 'PS', '2', '#f4f1ea'],
  ['player-06', 'JB', '11', '#9fd4ff'],
  ['player-07', 'AD', '15', '#3ec6ff'],
  ['player-08', 'TL', '3', '#f4f1ea'],
  ['player-09', 'HI', '5', '#5eb6ff'],
  ['player-10', 'MR', '14', '#3ec6ff'],
  ['player-11', 'CN', '8', '#a3a3a3'],
  ['player-12', 'OP', '1', '#a3a3a3'],
]

for (const [file, letters, number, accent] of players) {
  write(
    `images/players/${file}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" role="img" aria-label="Player portrait ${number}">
      <rect width="800" height="1000" fill="#101010"/>
      <text x="400" y="620" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="420" fill="#ffffff" opacity="0.06">${number}</text>
      <circle cx="400" cy="330" r="140" fill="${accent}"/>
      <path d="M180 980c40-230 120-330 220-330h0c100 0 180 100 220 330" fill="#242424"/>
      <text x="400" y="355" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="92" fill="#070707">${letters}</text>
      <rect x="0" y="900" width="800" height="100" fill="#3ec6ff"/>
      <text x="60" y="965" font-family="Arial Black, Arial, sans-serif" font-size="54" fill="#070707">#${number}</text>
    </svg>`,
  )
}

const teams = [
  ['default', 'OP', '#3ec6ff'],
  ['ridge', 'RC', '#f4f1ea'],
  ['harbor', 'HS', '#7dd3fc'],
  ['northline', 'NV', '#86efac'],
  ['summit', 'SB', '#fde68a'],
  ['lakeside', 'LA', '#93c5fd'],
  ['metro', 'MR', '#f9a8d4'],
  ['eastwind', 'EW', '#d1d5db'],
  ['pioneer', 'PN', '#fdba74'],
]

for (const [file, letters, accent] of teams) {
  write(
    `images/teams/${file}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" role="img" aria-label="${letters} team mark">
      <rect width="256" height="256" rx="48" fill="#070707"/>
      <circle cx="128" cy="128" r="78" fill="none" stroke="${accent}" stroke-width="10"/>
      <path d="M50 128h156M128 50c28 26 28 130 0 156M128 50c-28 26-28 130 0 156" fill="none" stroke="#f4f1ea" stroke-width="6"/>
      <text x="128" y="142" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="42" fill="${accent}">${letters}</text>
    </svg>`,
  )
}

const galleries = [
  ['rally', 'MATCH RALLY', 'M 80 620 L 360 300 L 840 300 L 1120 620', 'circle'],
  ['training', 'TRAINING', 'M 120 640 H 1080 M 220 640 V 360 M 980 640 V 360', 'cones'],
  ['tournament', 'TOURNAMENT', 'M 160 660 H 1040 M 600 180 V 420', 'cup'],
  ['celebration', 'CELEBRATION', 'M 200 680 C 280 420 420 420 500 620 M 700 620 C 780 400 940 400 1020 680', 'hands'],
  ['bench', 'BEHIND THE SCENES', 'M 140 560 H 1060 V 700 H 140 Z', 'bench'],
  ['block', 'AT THE NET', 'M 600 120 V 760 M 180 280 H 1020', 'net'],
  ['serve', 'SERVE', 'M 160 700 H 1040 M 160 700 L 420 280', 'serve'],
]

for (const [file, label, lines] of galleries) {
  write(
    `images/gallery/${file}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" role="img" aria-label="${label}">
      <rect width="1200" height="800" fill="#101010"/>
      <g opacity="0.25" stroke="#f4f1ea" stroke-width="1">
        ${Array.from({ length: 12 }, (_, index) => `<path d="M0 ${index * 70} H1200"/>`).join('')}
      </g>
      <path d="${lines}" fill="none" stroke="#3ec6ff" stroke-width="16" stroke-linejoin="round"/>
      <circle cx="860" cy="250" r="78" fill="#070707" stroke="#f4f1ea" stroke-width="8"/>
      <path d="M782 250h156M860 172c24 24 24 132 0 156M860 172c-24 24-24 132 0 156" fill="none" stroke="#3ec6ff" stroke-width="6"/>
      <text x="70" y="730" font-family="Arial Black, Arial, sans-serif" font-size="54" fill="#f4f1ea">${label}</text>
    </svg>`,
  )
}

write('videos/.gitkeep', '')
console.log('Club graphics written to public/')
