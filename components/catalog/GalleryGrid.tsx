'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { GalleryItem } from '@/lib/types'
import Lightbox from './Lightbox'

interface Props {
  items: GalleryItem[]
  categoryId: number
  totalCount: number
}


function ItemCard({ item, globalIdx, onClick }: { item: GalleryItem; globalIdx: number; onClick: () => void }) {
  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-sm bg-stone-100"
      onClick={onClick}
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
          priority={globalIdx < 3}
        />
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
  )
}

export default function GalleryGrid({ items, categoryId, totalCount }: Props) {
  const [allItems, setAllItems] = useState(items)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const hasMore = allItems.length < totalCount

  async function loadMore() {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const res = await fetch(`/api/gallery?categoryId=${categoryId}&page=${nextPage}`)
      const json = await res.json()
      const newItems: GalleryItem[] = Array.isArray(json) ? json : []
      if (newItems.length > 0) {
        setAllItems(prev => [...prev, ...newItems])
        setPage(nextPage)
      }
    } finally {
      setLoadingMore(false)
    }
  }

  if (!allItems.length) {
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

  // Round-robin distribution: item i always goes to column i % N.
  // This prevents layout shifts when new items are appended — existing items
  // never change their column assignment.
  const cols3 = [0, 1, 2].map(col =>
    allItems.map((item, i) => ({ item, globalIdx: i })).filter(({ globalIdx }) => globalIdx % 3 === col)
  )
  const cols2 = [0, 1].map(col =>
    allItems.map((item, i) => ({ item, globalIdx: i })).filter(({ globalIdx }) => globalIdx % 2 === col)
  )

  return (
    <>
      {/* Mobile: single column */}
      <div className="flex flex-col gap-4 sm:hidden">
        {allItems.map((item, idx) => (
          <ItemCard key={item.image_url} item={item} globalIdx={idx} onClick={() => setLightboxIdx(idx)} />
        ))}
      </div>

      {/* Tablet: 2 manual columns — no layout shift */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 items-start">
        {cols2.map((colItems, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-4">
            {colItems.map(({ item, globalIdx }) => (
              <ItemCard key={item.image_url} item={item} globalIdx={globalIdx} onClick={() => setLightboxIdx(globalIdx)} />
            ))}
          </div>
        ))}
      </div>

      {/* Desktop: 3 manual columns — no layout shift */}
      <div className="hidden lg:grid grid-cols-3 gap-4 items-start">
        {cols3.map((colItems, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-4">
            {colItems.map(({ item, globalIdx }) => (
              <ItemCard key={item.image_url} item={item} globalIdx={globalIdx} onClick={() => setLightboxIdx(globalIdx)} />
            ))}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 text-center">
          <p className="font-sans text-sm text-stone-400 mb-4">
            Mostrando {allItems.length} de {totalCount} fotos
          </p>
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="btn-secondary disabled:opacity-50"
          >
            {loadingMore ? 'Cargando...' : 'Cargar más fotos'}
          </button>
        </div>
      )}

      {lightboxIdx !== null && (
        <Lightbox
          items={allItems}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  )
}
