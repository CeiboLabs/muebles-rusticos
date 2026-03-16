import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Explore nuestro catálogo completo de muebles rústicos a medida: comedores, dormitorios, living, barbacoas, exterior y más.',
  alternates: { canonical: 'https://mueblesrusticos.com.uy/catalogo' },
}

export const revalidate = 3600

export default async function CatalogoPage() {
  const supabase = await createClient()
  const { data: dbCategories } = await supabase.from('categories').select('*')

  const categories = CATEGORIES.map(c => {
    const db = dbCategories?.find(d => d.slug === c.slug)
    return { ...c, cover_image_url: db?.cover_image_url ?? c.cover }
  })

  return (
    <>
      {/* Header */}
      <section className="py-16 bg-stone-50 border-b border-stone-100">
        <div className="container-max section-padding">
          <span className="eyebrow mb-5 inline-flex">Todo nuestro trabajo</span>
          <h1 className="font-serif text-5xl font-bold text-stone-900">Catálogo</h1>
          <p className="mt-4 font-sans text-stone-600 max-w-lg font-light">
            Cada pieza es fabricada a medida. Explore las categorías y contáctenos para obtener su presupuesto.
          </p>
        </div>
      </section>

      {/* Categories grid */}
      <section className="py-16 bg-white">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/catalogo/${cat.slug}`}
                className="group flex flex-col bg-stone-50 hover:shadow-md transition-shadow duration-300 rounded-sm overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  {cat.cover_image_url ? (
                    <Image
                      src={cat.cover_image_url}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-wood-100 to-wood-200 flex items-center justify-center">
                      <span className="font-serif text-5xl text-wood-400">
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-wood-700 transition-colors">
                      {cat.name}
                    </h2>
                    <p className="font-sans text-sm text-stone-600 mt-1">{cat.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-stone-300 group-hover:text-wood-500 transition-colors shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
