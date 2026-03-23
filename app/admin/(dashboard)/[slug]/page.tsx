import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES } from '@/lib/constants'
import AdminGallery from '@/components/admin/AdminGallery'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminCategoryPage({ params }: Props) {
  const { slug } = await params
  const cat = CATEGORIES.find(c => c.slug === slug)
  if (!cat) return notFound()

  const supabase = await createClient()

  const { data: dbCat } = await supabase
    .from('categories')
    .select('id, cover_image_url')
    .eq('slug', slug)
    .single()

  const categoryId = dbCat?.id ?? 0

  const { data: items } = await supabase
    .from('gallery_items')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-6 md:mb-8">
        <div>
          <nav className="flex items-center gap-2 font-sans text-sm text-stone-400 mb-2">
            <Link href="/admin" className="hover:text-stone-700">Dashboard</Link>
            <span>/</span>
            <span className="text-stone-700">{cat.name}</span>
          </nav>
          <h1 className="font-serif text-3xl font-bold text-stone-900">{cat.name}</h1>
          <p className="font-sans text-stone-500 mt-1">
            {items?.length ?? 0} imagen{(items?.length ?? 0) !== 1 ? 'es' : ''} en esta categoría
          </p>
        </div>
        <Link
          href={`/catalogo/${slug}`}
          target="_blank"
          className="btn-ghost text-sm shrink-0"
        >
          Ver en el sitio →
        </Link>
      </div>

      <AdminGallery
        initialItems={items ?? []}
        categoryId={categoryId}
        categorySlug={slug}
        categoryName={cat.name}
        initialCoverUrl={dbCat?.cover_image_url ?? null}
      />
    </div>
  )
}
