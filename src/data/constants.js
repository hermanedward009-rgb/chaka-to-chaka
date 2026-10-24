export const POSITIONS = [
  'Setter',
  'Outside Hitter',
  'Opposite Hitter',
  'Middle Blocker',
  'Libero',
  'Defensive Specialist',
]

export const MATCH_STATUSES = ['upcoming', 'completed', 'postponed', 'cancelled']

export const MATCH_TYPES = ['Friendly', 'League', 'Cup', 'Tournament']

export const MATCH_FORMATS = {
  'best-of-1': { label: 'Best of 1', setsToWin: 1, maxSets: 1 },
  'best-of-3': { label: 'Best of 3', setsToWin: 2, maxSets: 3 },
  'best-of-5': { label: 'Best of 5', setsToWin: 3, maxSets: 5 },
}

export const GALLERY_CATEGORIES = [
  'Matches',
  'Training',
  'Tournaments',
  'Team celebrations',
  'Behind the scenes',
]

export const STORAGE_KEY = 'chaka-to-chaka-data-v2'
export const ADMIN_SESSION_KEY = 'ctc-admin-session'
