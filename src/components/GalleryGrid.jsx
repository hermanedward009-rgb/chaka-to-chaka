import { Play } from 'lucide-react'
import { formatDate } from '../utils/format.js'
import MediaImage from './MediaImage.jsx'

function youtubeThumb(id) {
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''
}

export default function GalleryGrid({ items, onOpen }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const playableVideo = item.type === 'video' && item.src
        const playableYoutube = item.type === 'youtube' && item.youtubeId
        const preview = item.type === 'image' ? item.src : item.poster || youtubeThumb(item.youtubeId)

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-3xl border border-line bg-card shadow-lg shadow-black/20"
          >
            {playableVideo ? (
              <video
                controls
                preload="metadata"
                poster={item.poster || undefined}
                className="aspect-video w-full bg-black"
              >
                <source src={item.src} />
              </video>
            ) : playableYoutube ? (
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
                title={item.caption}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button type="button" className="relative block w-full text-left" aria-label={item.caption} onClick={() => onOpen(item)}>
                <MediaImage
                  src={preview}
                  alt={item.alt || item.caption}
                  fallbackLabel={item.category}
                  className="aspect-[3/2] w-full"
                />
                {item.type !== 'image' && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-flare text-on-flare">
                      <Play size={22} aria-hidden="true" />
                    </span>
                  </span>
                )}
              </button>
            )}
            <div className="p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-flare">
                {item.category}
                {item.type !== 'image' ? ` · ${item.type === 'youtube' ? 'YouTube' : 'Video'}` : ''}
              </p>
              <h2 className="mt-2 text-sm leading-6 text-sand">{item.caption}</h2>
              <p className="mt-2 text-xs text-faint">{formatDate(item.date)}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}
