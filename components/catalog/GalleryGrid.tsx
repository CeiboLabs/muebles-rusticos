'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { GalleryItem } from '@/lib/types'
import Lightbox from './Lightbox'

interface Props {
  items: GalleryItem[]
}

const PAGE_SIZE = 12

export default function GalleryGrid({ items }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)

  if (!items.length) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">🪵</div>
        <p className="font-serif text-2xl text-stone-500 mb-2">Próximamente</p>
        <p className="font-sans text-stone-400">
          Estamos preparando las fotos de esta categoría. Vuelva pronto.
        </p>
      </div>
    )
  }

  const displayed = items.slice(0, visible)
  const hasMore = visible < items.length

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {displayed.map((item, idx) => (
          <div
            key={item.image_url}
            className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-sm bg-stone-100"
            onClick={() => setLightboxIdx(idx)}
          >
            <div className="relative w-full">
              <Image
                src={item.image_url}
                alt={item.title ?? 'Mueble rústico'}
                width={800}
                height={600}
                style={{ height: 'auto' }}
                className="w-full group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-colors duration-300 flex flex-col items-center justify-center gap-3">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-3 px-4">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg shrink-0">
                    <svg className="w-5 h-5 text-stone-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  {item.title && (
                    <p className="font-sans text-white text-xs font-medium text-center drop-shadow-lg leading-snug tracking-wide">{item.title}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <p className="font-sans text-sm text-stone-400 mb-4">
            Mostrando {displayed.length} de {items.length} fotos
          </p>
          <button
            onClick={() => setVisible(v => v + PAGE_SIZE)}
            className="btn-secondary"
          >
            Cargar más fotos
          </button>
        </div>
      )}

      {lightboxIdx !== null && (
        <Lightbox
          items={items}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  )
}
