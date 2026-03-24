'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { GalleryItem } from '@/lib/types'

interface Props {
  item: GalleryItem
  onClose: () => void
  onSuccess: () => void
}

const MAX_DIMENSION = 1920
const JPEG_QUALITY = 0.82

async function rotateImageBlob(sourceUrl: string): Promise<{ file: File; preview: string }> {
  // Fetch as blob first to avoid cross-origin canvas tainting
  const response = await fetch(sourceUrl)
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      // 90° clockwise: output width = input height
      const outW = img.height
      const outH = img.width
      const scale = Math.min(1, MAX_DIMENSION / Math.max(outW, outH))
      const finalW = Math.round(outW * scale)
      const finalH = Math.round(outH * scale)

      const canvas = document.createElement('canvas')
      canvas.width = finalW
      canvas.height = finalH
      const ctx = canvas.getContext('2d')!
      ctx.translate(finalW / 2, finalH / 2)
      ctx.rotate(Math.PI / 2)
      ctx.scale(scale, scale)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      canvas.toBlob(rotatedBlob => {
        if (!rotatedBlob) { reject(new Error('Canvas error')); return }
        const file = new File([rotatedBlob], 'rotated.jpg', { type: 'image/jpeg' })
        resolve({ file, preview: URL.createObjectURL(file) })
      }, 'image/jpeg', JPEG_QUALITY)
    }
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Load error')) }
    img.src = objectUrl
  })
}

export default function EditItemModal({ item, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState(item.title ?? '')
  const [loading, setLoading] = useState(false)
  const [rotating, setRotating] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [rotatedFile, setRotatedFile] = useState<File | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  async function handleRotate() {
    setRotating(true)
    setError('')
    try {
      const sourceUrl = previewUrl ?? item.image_url
      const { file, preview } = await rotateImageBlob(sourceUrl)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(preview)
      setRotatedFile(file)
    } catch {
      setError('Error al rotar la imagen.')
    } finally {
      setRotating(false)
    }
  }

  async function handleSave() {
    setLoading(true)
    setError('')
    const supabase = createClient()

    let newImageUrl: string | undefined

    if (rotatedFile) {
      const oldPath = item.image_url.split('/gallery/')[1]?.split('?')[0]
      if (oldPath) {
        const folder = oldPath.split('/')[0]
        const ext = oldPath.split('.').pop() ?? 'jpg'
        const newPath = `${folder}/${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(newPath, rotatedFile, { contentType: 'image/jpeg' })

        if (uploadError) {
          setError('Error al guardar la rotación: ' + uploadError.message)
          setLoading(false)
          return
        }

        const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(newPath)
        newImageUrl = publicUrl

        // Delete old file after successful upload
        await supabase.storage.from('gallery').remove([oldPath])
      }
    }

    const { error: dbError } = await supabase
      .from('gallery_items')
      .update({
        title: title || null,
        ...(newImageUrl ? { image_url: newImageUrl, size_bytes: rotatedFile!.size } : {}),
      })
      .eq('id', item.id)

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }
    onSuccess()
    onClose()
  }

  const inputClass =
    'w-full px-3 py-2.5 border border-stone-200 rounded-sm font-sans text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-wood-400 focus:ring-1 focus:ring-wood-400 transition-colors'

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-serif text-lg font-semibold text-stone-900">Editar imagen</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Preview + rotate button */}
          <div className="relative w-full aspect-video bg-stone-100 rounded-sm overflow-hidden">
            <Image
              src={previewUrl ?? item.image_url}
              alt={title || 'Imagen'}
              fill
              unoptimized={!!previewUrl}
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            {/* Rotate button */}
            <button
              type="button"
              onClick={handleRotate}
              disabled={rotating}
              title="Rotar 90°"
              className="absolute bottom-2 left-2 w-8 h-8 bg-white border border-stone-200 rounded-full flex items-center justify-center hover:bg-wood-50 hover:border-wood-300 transition-colors shadow-sm disabled:opacity-50"
            >
              <svg
                className={`w-4 h-4 text-stone-600 ${rotating ? 'animate-spin' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            {/* Badge when rotated */}
            {rotatedFile && (
              <span className="absolute bottom-2 right-2 bg-wood-700 text-white font-sans text-xs px-2 py-0.5 rounded-sm">
                Rotada
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block font-sans text-xs font-medium text-stone-600 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título de la imagen"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-stone-100">
          <button onClick={onClose} className="btn-ghost text-sm">Cancelar</button>
          <button
            onClick={handleSave}
            disabled={loading || rotating}
            className="btn-primary text-sm py-2 disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
