import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useEffect } from 'react'
import { formatDate } from '../utils/format.js'

export default function GalleryLightbox({ items, index, onClose, onIndex }) {
  const item = index == null ? null : items[index]

  useEffect(() => {
    if (!item) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onIndex((index + 1) % items.length)
      if (event.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [item, index, items.length, onClose, onIndex])

  if (!item) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.caption}
        className="relative w-full max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white"
          aria-label="Close gallery item"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        {items.length > 1 && (
          <>
            <button
              type="button"
              className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white"
              aria-label="Previous item"
              onClick={() => onIndex((index - 1 + items.length) % items.length)}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/70 text-white"
              aria-label="Next item"
              onClick={() => onIndex((index + 1) % items.length)}
            >
              <ChevronRight />
            </button>
          </>
        )}
        <div className="overflow-hidden rounded-3xl border border-line bg-black">
          {item.type === 'youtube' && item.youtubeId ? (
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
              title={item.caption}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : item.type === 'video' && item.src ? (
            <video key={item.src} className="aspect-video w-full bg-black" controls playsInline poster={item.poster || undefined}>
              <source src={item.src} />
            </video>
          ) : item.type === 'image' && item.src ? (
            <img src={item.src} alt={item.alt || item.caption} className="max-h-[70vh] w-full object-contain" />
          ) : (
            <div className="grid aspect-video place-items-center px-6 text-center text-sm text-white/70">
              This {item.type} slot does not have a file or YouTube link yet. Add one in the admin panel.
              Copy permanent files into public/images or public/videos and store the path, not a large upload.
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-white">{item.caption}</p>
        <p className="text-xs uppercase tracking-[0.16em] text-white/60">
          {item.category} · {formatDate(item.date)}
        </p>
      </div>
    </div>
  )
}
