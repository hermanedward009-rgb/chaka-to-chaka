import { useState } from 'react'
import { initials } from '../utils/format.js'

export default function MediaImage({
  src,
  alt,
  className = '',
  fallbackLabel = '',
  eager = false,
  fit = 'cover',
}) {
  const [seenSrc, setSeenSrc] = useState(src)
  const [failed, setFailed] = useState(!src)
  const [loaded, setLoaded] = useState(false)

  if (src !== seenSrc) {
    setSeenSrc(src)
    setFailed(!src)
    setLoaded(false)
  }

  if (failed) {
    return (
      <div
        className={`grid place-items-center bg-ink text-flare ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="font-display text-4xl">{initials(fallbackLabel || alt || 'CTC')}</span>
      </div>
    )
  }

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {!loaded && <span className="absolute inset-0 animate-pulse bg-surface" />}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full transition-opacity ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </span>
  )
}
