'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { STORAGE_LIMIT_BYTES } from '@/lib/constants'

interface Props {
  categoryId: number
  categorySlug: string
  onSuccess: () => void
}

interface FormState {
  title: string
  file: File | null
  preview: string | null
  rotation: number // 0, 90, 180, 270
}

const MAX_DIMENSION = 1920
const WEBP_QUALITY = 0.85

async function processImage(file: File, rotateDegrees = 0): Promise<{ file: File; preview: string }> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    img.onload = () => {
      const rad = (rotateDegrees * Math.PI) / 180
      const swap = rotateDegrees === 90 || rotateDegrees === 270

      // Natural dimensions after rotation
      const natW = swap ? img.height : img.width
      const natH = swap ? img.width : img.height

      // Scale down if either dimension exceeds MAX_DIMENSION
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

      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('Canvas error')); return }
        const webpName = file.name.replace(/\.[^.]+$/, '.webp')
        const processed = new File([blob], webpName, { type: 'image/webp' })
        const preview = URL.createObjectURL(processed)
        resolve({ file: processed, preview })
      }, 'image/webp', WEBP_QUALITY)
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export default function ImageUploader({ categoryId, categorySlug, onSuccess }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<FormState>({
    title: '', file: null, preview: null, rotation: 0,
  })
  const [loading, setLoading] = useState(false)
  const [rotating, setRotating] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se aceptan archivos de imagen.')
      return
    }
    if (file.size > 2.5 * 1024 * 1024) {
      setError('La imagen no puede superar 2,5 MB.')
      return
    }
    setError('')
    setRotating(true)
    try {
      const { file: processed, preview } = await processImage(file)
      setForm(prev => ({ ...prev, file: processed, preview, rotation: 0 }))
    } catch {
      setError('Error al procesar la imagen.')
    } finally {
      setRotating(false)
    }
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleRotate(e: React.MouseEvent) {
    e.stopPropagation()
    if (!form.file) return
    setRotating(true)
    try {
      const newRotation = (form.rotation + 90) % 360
      const { file, preview } = await processImage(form.file, 90)
      setForm(prev => ({ ...prev, file, preview, rotation: newRotation }))
    } catch {
      setError('Error al rotar la imagen.')
    } finally {
      setRotating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.file) { setError('Seleccione una imagen.'); return }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()

      // Check storage limit before uploading
      const { data: storageData } = await supabase.from('gallery_items').select('size_bytes')
      const usedBytes = (storageData ?? []).reduce((sum, r) => sum + (r.size_bytes ?? 0), 0)
      if (usedBytes + form.file.size > STORAGE_LIMIT_BYTES) {
        const limitMB = (STORAGE_LIMIT_BYTES / 1024 / 1024).toFixed(0)
        setError(`Límite de almacenamiento alcanzado (${limitMB} MB). No se pueden subir más imágenes.`)
        setLoading(false)
        return
      }

      const ext = 'webp'
      const path = `${categorySlug}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(path, form.file, { contentType: 'image/webp' })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(path)

      const { error: dbError } = await supabase
        .from('gallery_items')
        .insert({
          category_id: categoryId,
          title: form.title || null,
          image_url: publicUrl,
          size_bytes: form.file.size,
        })

      if (dbError) throw dbError

      setForm({ title: '', file: null, preview: null, rotation: 0 })
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(`Error al subir: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2.5 border border-stone-200 rounded-sm font-sans text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-wood-400 focus:ring-1 focus:ring-wood-400 transition-colors'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative border-2 border-dashed rounded-sm cursor-pointer transition-colors ${
          dragOver ? 'border-wood-400 bg-wood-50' : 'border-stone-200 hover:border-wood-300 bg-stone-50'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {form.preview ? (
          <div className="relative w-full aspect-video">
            <Image
              src={form.preview}
              alt="Preview"
              fill
              className="object-contain rounded-sm p-2"
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
            {/* Remove button */}
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setForm(prev => ({ ...prev, file: null, preview: null, rotation: 0 })) }}
              className="absolute top-2 right-2 w-7 h-7 bg-white border border-stone-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <svg className="w-10 h-10 text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="font-sans text-sm text-stone-500">
              <span className="text-wood-600 font-medium">Haga clic</span> o arrastre una imagen aquí
            </p>
            <p className="font-sans text-xs text-stone-400 mt-1">JPG, PNG, WEBP — máx. 2,5 MB</p>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div>
        <label className="block font-sans text-xs font-medium text-stone-600 mb-1">Título (opcional)</label>
        <input
          type="text"
          value={form.title}
          onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Ej: Mesa de comedor 6 personas"
          className={inputClass}
        />
      </div>
      {error && (
        <p className="font-sans text-xs text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !form.file}
        className="btn-primary w-full text-sm py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Subiendo...' : 'Subir imagen'}
      </button>
    </form>
  )
}
