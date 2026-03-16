import Image from 'next/image'
import Link from 'next/link'
import type { GalleryItem } from '@/lib/types'

interface Props {
  items: GalleryItem[]
}

export default function FeaturedItems({ items }: Props) {
  if (!items.length) return null

  return (
    <section className="py-20 bg-stone-50">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-12 bg-wood-300" />
              <span className="font-sans text-xs font-medium tracking-widest uppercase text-wood-600">
                Trabajos recientes
              </span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-stone-900">Últimas creaciones</h2>
          </div>
          <Link href="/catalogo" className="btn-ghost text-sm shrink-0">
            Ver todo el catálogo →
          </Link>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item, idx) => (
            <Link
              key={item.id}
              href={`/catalogo/${item.category?.slug ?? ''}`}
              className={`group relative overflow-hidden rounded-sm bg-stone-100 ${
                idx === 0 ? 'sm:row-span-2' : ''
              }`}
            >
              <div className={`relative w-full ${idx === 0 ? 'aspect-[3/4]' : 'aspect-square'}`}>
                <Image
                  src={item.image_url}
                  alt={item.title ?? 'Mueble rústico'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {(item.title || item.category) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {item.title && (
                      <h3 className="font-serif text-white font-semibold">{item.title}</h3>
                    )}
                    {item.category && (
                      <p className="font-sans text-xs text-white/70 mt-1">{item.category.name}</p>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
