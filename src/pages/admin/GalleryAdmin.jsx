import { useState } from 'react'
import ConfirmationModal from '../../components/ConfirmationModal.jsx'
import GalleryForm from '../../components/GalleryForm.jsx'
import { useClubData } from '../../hooks/useClubData.js'
import { createId } from '../../utils/ids.js'
import { MEDIA_GUIDE } from '../../utils/media.js'
import { ghostButton } from '../../utils/ui.js'

function blankItem() {
  return {
    id: createId('gallery'),
    type: 'image',
    src: '',
    youtubeId: '',
    poster: '',
    category: 'Matches',
    caption: '',
    alt: '',
    date: '',
  }
}

export default function GalleryAdmin() {
  const { gallery, saveGalleryItem, deleteGalleryItem } = useClubData()
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-5xl uppercase leading-none">Gallery</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{MEDIA_GUIDE}</p>
        </div>
        <button type="button" className={ghostButton} onClick={() => setEditing(blankItem())}>
          Add item
        </button>
      </div>
      {editing && (
        <GalleryForm
          key={editing.id}
          item={editing}
          onCancel={() => setEditing(null)}
          onSave={(item) => {
            saveGalleryItem(item)
            setEditing(null)
          }}
        />
      )}
      <ul className="space-y-3">
        {[...gallery].sort((a, b) => b.date.localeCompare(a.date)).map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line px-4 py-3">
            <div>
              <p className="font-semibold">{item.caption}</p>
              <p className="text-sm text-muted">{item.category} · {item.type} · {item.date}</p>
            </div>
            <div className="flex gap-4">
              <button type="button" className="text-sm font-semibold text-flare" onClick={() => setEditing(item)}>Edit</button>
              <button type="button" className="text-sm text-muted" onClick={() => setPendingDelete(item)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title="Remove this gallery item?"
        message="The entry will be removed from this browser. A file in the public folder is not deleted from the project."
        confirmLabel="Remove item"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          deleteGalleryItem(pendingDelete.id)
          setPendingDelete(null)
          setEditing(null)
        }}
      />
    </div>
  )
}
