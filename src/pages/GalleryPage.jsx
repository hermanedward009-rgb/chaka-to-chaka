import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState.jsx'
import GalleryGrid from '../components/GalleryGrid.jsx'
import GalleryLightbox from '../components/GalleryLightbox.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { GALLERY_CATEGORIES } from '../data/constants.js'
import { useClubData } from '../hooks/useClubData.js'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function GalleryPage() {
  const { gallery } = useClubData()
  const [category, setCategory] = useState('All')
  const [index, setIndex] = useState(null)
  usePageTitle('Gallery')

  const visible = useMemo(() => {
    return [...gallery]
      .filter((item) => category === 'All' || item.category === category)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [gallery, category])

  return (
    <div className="pb-16">
      <PageHeader eyebrow="Media" title="Gallery">
        <p>Match photos, training, tournaments, celebrations, and behind-the-scenes moments. Open an image for a larger view, or play a video from its card.</p>
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', ...GALLERY_CATEGORIES].map((item) => (
            <button
              key={item}
              type="button"
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${category === item ? 'bg-flare text-on-flare' : 'border border-line'}`}
              onClick={() => {
                setCategory(item)
                setIndex(null)
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4">
        {visible.length === 0 ? (
          <EmptyState title="Nothing in this category">Add photos or videos from the admin panel.</EmptyState>
        ) : (
          <GalleryGrid items={visible} onOpen={(item) => setIndex(visible.findIndex((entry) => entry.id === item.id))} />
        )}
      </div>
      <GalleryLightbox items={visible} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </div>
  )
}
