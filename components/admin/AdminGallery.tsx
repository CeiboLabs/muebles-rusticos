'use client'

import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { GalleryItem } from '@/lib/types'
import EditItemModal from './EditItemModal'
import ImageUploader from './ImageUploader'
import Toast from './Toast'

interface Props {
  initialItems: GalleryItem[]
  categoryId: number
  categorySlug: string
  categoryName: string
}

export default function AdminGallery({ initialItems, categoryId, categorySlug, categoryName }: Props) {
  const [items, setItems] = useState(initialItems)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmItem, setConfirmItem] = useState<GalleryItem | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
  }

  async function refresh() {
    const supabase = createClient()
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
    setItems(data ?? [])
  }

  async function handleDelete(item: GalleryItem) {
    setConfirmItem(null)
    setDeletingId(item.id)
    const supabase = createClient()

    // Remove from storage
    const urlParts = item.image_url.split('/gallery/')
    if (urlParts[1]) {
      await supabase.storage.from('gallery').remove([urlParts[1]])
    }

    // Remove from DB
    await supabase.from('gallery_items').delete().eq('id', item.id)
    setDeletingId(null)
    setItems(prev => prev.filter(i => i.id !== item.id))
    showToast('Imagen eliminada')
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Uploader */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-stone-100 rounded-sm shadow-sm p-5 lg:sticky lg:top-8">
            <h2 className="font-serif text-lg font-semibold text-stone-900 mb-4">Subir imagen</h2>
            <ImageUploader
              categoryId={categoryId}
              categorySlug={categorySlug}
              onSuccess={() => { refresh(); showToast('Imagen subida correctamente') }}
            />
          </div>
        </div>

        {/* Gallery */}
        <div className="lg:col-span-3">
          {items.length === 0 ? (
            <div className="text-center py-20 bg-white border border-stone-100 rounded-sm">
              <div className="text-5xl mb-4">📷</div>
              <p className="font-serif text-xl text-stone-500 mb-1">Sin imágenes</p>
              <p className="font-sans text-sm text-stone-400">
                Use el formulario para subir la primera imagen a {categoryName}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map(item => (
                <div key={item.id} className="group relative bg-white border border-stone-100 rounded-sm overflow-hidden shadow-sm">
                  <div className="relative aspect-square">
                    <Image
                      src={item.image_url}
                      alt={item.title ?? 'Imagen'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    {/* Actions overlay */}
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-colors duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors shadow-sm"
                        title="Editar"
                      >
                        <svg className="w-4 h-4 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmItem(item)}
                        disabled={deletingId === item.id}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
                        title="Eliminar"
                      >
                        {deletingId === item.id ? (
                          <svg className="w-4 h-4 text-stone-400 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                  {(item.title || item.description) && (
                    <div className="p-3 border-t border-stone-50">
                      {item.title && (
                        <p className="font-sans text-xs font-medium text-stone-700 truncate">{item.title}</p>
                      )}
                      {item.description && (
                        <p className="font-sans text-xs text-stone-400 truncate mt-0.5">{item.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSuccess={() => { refresh(); showToast('Cambios guardados') }}
        />
      )}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {confirmItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 flex items-center justify-center p-4" onClick={() => setConfirmItem(null)}>
          <div className="bg-white rounded-sm shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5">
              <h2 className="font-serif text-lg font-semibold text-stone-900 mb-2">Eliminar imagen</h2>
              <p className="font-sans text-sm text-stone-500">
                ¿Estás seguro que querés eliminar{' '}
                <span className="font-medium text-stone-700">"{confirmItem.title ?? 'sin título'}"</span>?
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-100">
              <button onClick={() => setConfirmItem(null)} className="btn-ghost text-sm">
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmItem)}
                className="bg-red-600 hover:bg-red-700 text-white font-sans text-sm font-medium px-4 py-2 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
