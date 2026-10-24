export function readFileAsDataUrl(file, maxBytes) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Choose a file.'))
      return
    }
    if (file.size > maxBytes) {
      reject(
        new Error(
          'That file is too large to keep in browser storage. Copy it into public/images or public/videos, then enter its path, such as /images/players/photo.jpg.',
        ),
      )
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('The file could not be read.'))
    reader.readAsDataURL(file)
  })
}

export function extractYoutubeId(input) {
  const value = String(input || '').trim()
  if (!value) return ''
  if (/^[\w-]{11}$/.test(value)) return value
  try {
    const url = new URL(value)
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.split('/').filter(Boolean)[0] || ''
      return /^[\w-]{11}$/.test(id) ? id : ''
    }
    const watch = url.searchParams.get('v')
    if (watch && /^[\w-]{11}$/.test(watch)) return watch
    const embed = url.pathname.match(/\/embed\/([\w-]{11})/)
    if (embed) return embed[1]
    const shorts = url.pathname.match(/\/shorts\/([\w-]{11})/)
    if (shorts) return shorts[1]
  } catch {
    return ''
  }
  return ''
}

export const MEDIA_GUIDE =
  'Browser uploads are saved only in this browser and can fill its storage. For a permanent photo or video on the deployed site, copy the file into public/images or public/videos and enter the path, for example /images/gallery/final.jpg. Large media should not be stored in localStorage.'
