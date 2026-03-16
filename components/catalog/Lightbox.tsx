'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import type { GalleryItem } from '@/lib/types'

interface Props {
  items: GalleryItem[]
  initialIndex: number
  onClose: () => void
}

export default function Lightbox({ items, initialIndex, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex)
  const current = items[idx]

  const prev = useCallback(() => setIdx(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIdx(i => Math.min(items.length - 1, i + 1)), [items.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
        aria-label="Cerrar"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-sans text-sm text-white/50">
        {idx + 1} / {items.length}
      </div>

      {/* Prev */}
      {idx > 0 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Anterior"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next */}
      {idx < items.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Siguiente"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image + title */}
      <div
        className="flex flex-col items-center justify-center gap-4 mx-14"
        style={{ width: 'calc(100vw - 7rem)', height: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative flex-1 w-full min-h-0">
          <Image
            src={current.image_url}
            alt={current.title ?? 'Mueble rústico'}
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
        </div>
        {current.title && (
          <p className="font-sans text-white/80 text-sm font-normal tracking-wider uppercase shrink-0">
            {current.title}
          </p>
        )}
      </div>
    </div>
  )
}
