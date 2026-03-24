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

// Always rotates from a blob (avoids chaining fetch of blob URLs)
async function rotateBlobDegrees(blob: Blob, degrees: number): Promise<{ file: File; preview: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob)
    const img = document.createElement('img')
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const rad = (degrees * Math.PI) / 180
      const swap = degrees === 90 || degrees === 270
      const natW = swap ? img.height : img.width
      const natH = swap ? img.width : img.height
      const scale = Math.min(1, MAX_DIMENSION / Math.max(natW, natH))
      const outW = Math.round(natW * scale)
      const outH = Math.round(natH * scale)

      const canvas = document.createElement('canvas')
      canvas.width = outW
      canvas.height = outH
      const ctx = canvas.getContext('2d')!
      ctx.translate(outW / 2, outH / 2)
      ctx.rotate(rad)
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
  // Cache the original blob so we always rotate from source (no chaining)
  const [originalBlob, setOriginalBlob] = useState<Blob | null>(null)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }
  }, [previewUrl])

  async function handleRotate() {
    setRotating(true)
    setError('')
    try {
      // Fetch original image only once, then reuse cached blob
      let blob = originalBlob
      if (!blob) {
        const res = await fetch(item.image_url)
        blob = await res.blob()
        setOriginalBlob(blob)
      }

      const newRotation = (rotation + 90) % 360
      setRotation(newRotation)

      if (newRotation === 0) {
        // Back to original — no modification needed
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
        setRotatedFile(null)
      } else {
        const { file, preview } = await rotateBlobDegrees(blob, newRotation)
        if (previewUrl) URL.revokeObjectURL(previewUrl)
        setPreviewUrl(preview)
        setRotatedFile(file)
      }
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
            {/* Badge showing current rotation */}
            {rotation > 0 && (
              <span className="absolute bottom-2 right-2 bg-wood-700 text-white font-sans text-xs px-2 py-0.5 rounded-sm">
                {rotation}°
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
