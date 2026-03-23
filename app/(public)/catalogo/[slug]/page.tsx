import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, CONTACT_INFO } from '@/lib/constants'
import GalleryGrid from '@/components/catalog/GalleryGrid'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return CATEGORIES.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORIES.find(c => c.slug === slug)
  if (!cat) return {}

  const supabase = await createClient()
  const { data: dbCat } = await supabase
    .from('categories')
    .select('cover_image_url')
    .eq('slug', slug)
    .single()

  const coverUrl = dbCat?.cover_image_url ?? null

  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: `https://mueblesrusticos.com.uy/catalogo/${slug}` },
    openGraph: {
      title: `${cat.name} | Muebles Rústicos Solymar`,
      description: cat.description,
      ...(coverUrl && { images: [{ url: coverUrl, width: 1200, height: 630, alt: cat.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.name} | Muebles Rústicos Solymar`,
      description: cat.description,
      ...(coverUrl && { images: [coverUrl] }),
    },
  }
}

export const revalidate = 3600

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const cat = CATEGORIES.find(c => c.slug === slug)
  if (!cat) return notFound()

  const supabase = await createClient()
  const { data: dbCat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .single()

  const { data: supabaseItems } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('category_id', dbCat?.id ?? 0)
    .order('created_at', { ascending: false })

  const galleryItems = supabaseItems ?? []

  return (
    <>
      {/* Breadcrumb + Header */}
      <section className="py-10 bg-stone-50 border-b border-stone-100">
        <div className="container-max section-padding">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-sans text-sm text-stone-400 mb-6">
            <Link href="/" className="hover:text-wood-600 transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/catalogo" className="hover:text-wood-600 transition-colors">Catálogo</Link>
            <span>/</span>
            <span className="text-stone-700">{cat.name}</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-4xl font-bold text-stone-900">{cat.name}</h1>
              <p className="mt-2 font-sans text-stone-500">{cat.description}</p>
            </div>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hola,%20estoy%20interesado%20en%20${encodeURIComponent(cat.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary shrink-0"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 bg-white">
        <div className="container-max section-padding">
          <GalleryGrid items={galleryItems} />
        </div>
      </section>

      {/* Back nav */}
      <section className="py-10 bg-stone-50 border-t border-stone-100">
        <div className="container-max section-padding flex items-center justify-between">
          <Link href="/catalogo" className="btn-ghost">
            ← Volver al catálogo
          </Link>
          <Link href="/contacto" className="btn-secondary text-sm">
            Solicitar presupuesto
          </Link>
        </div>
      </section>
    </>
  )
}
