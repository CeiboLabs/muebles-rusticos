import Link from 'next/link'
import Image from 'next/image'
import { CATEGORIES } from '@/lib/constants'
import type { Category } from '@/lib/types'

interface Props {
  dbCategories?: Category[]
}

// Slugs destacados para mostrar en el home (6 de 12)
const FEATURED_SLUGS = ['comedores', 'living', 'dormitorios', 'barbacoas', 'exterior', 'hierro-y-madera']

export default function CategoryGrid({ dbCategories }: Props) {
  const allCategories = CATEGORIES.map(c => {
    const dbCat = dbCategories?.find(d => d.slug === c.slug)
    return { ...c, cover_image_url: dbCat?.cover_image_url ?? null }
  })

  // Solo las 6 destacadas
  const categories = FEATURED_SLUGS
    .map(slug => allCategories.find(c => c.slug === slug))
    .filter(Boolean) as typeof allCategories

  return (
    <section className="py-20 bg-white">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="eyebrow justify-center mb-4 inline-flex">Nuestras categorías</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-stone-900">
            Catálogo de Muebles
          </h2>
          <p className="mt-4 font-sans text-stone-600 max-w-md mx-auto font-light">
            Una selección de nuestras líneas más populares
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/catalogo/${cat.slug}`}
              className="group relative aspect-square overflow-hidden bg-stone-100 hover:shadow-xl transition-shadow duration-300"
            >
              {cat.cover_image_url ? (
                <Image
                  src={cat.cover_image_url}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={FEATURED_SLUGS.indexOf(cat.slug) < 2}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-wood-100 to-wood-200 flex items-center justify-center">
                  <span className="font-serif text-5xl text-wood-400">{cat.name.charAt(0)}</span>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              {/* Category name */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <h3 className="font-serif text-white text-sm md:text-base font-semibold leading-tight">
                  {cat.name}
                </h3>
              </div>
              {/* Arrow on hover */}
              <div className="absolute top-2 right-2 w-7 h-7 bg-white/25 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/catalogo" className="btn-secondary">
            Ver las 12 categorías
          </Link>
        </div>
      </div>
    </section>
  )
}
