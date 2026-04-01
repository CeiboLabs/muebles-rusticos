import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, STORAGE_LIMIT_BYTES } from '@/lib/constants'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Run all queries concurrently; combine the two gallery_items full scans into one
  const [
    { data: recentItems },
    { data: statsData },
    { data: dbCategories },
  ] = await Promise.all([
    supabase
      .from('gallery_items')
      .select('*, category:categories(name,slug)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('gallery_items')
      .select('category_id, size_bytes'),
    supabase
      .from('categories')
      .select('id, slug'),
  ])

  const totalItems = statsData?.length ?? 0

  const countMap: Record<number, number> = {}
  let usedBytes = 0
  for (const row of statsData ?? []) {
    countMap[row.category_id] = (countMap[row.category_id] ?? 0) + 1
    usedBytes += row.size_bytes ?? 0
  }

  const slugToCount: Record<string, number> = {}
  for (const dbCat of dbCategories ?? []) {
    slugToCount[dbCat.slug] = countMap[dbCat.id] ?? 0
  }

  const limitMB = STORAGE_LIMIT_BYTES / 1024 / 1024
  const usedMBRounded = usedBytes / 1024 / 1024
  const usedMB = usedMBRounded.toFixed(1)
  const usagePercent = Math.min(100, (usedMBRounded / limitMB) * 100)

  return (
    <div className="p-4 md:p-8">
      <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Dashboard</h1>
      <p className="font-sans text-stone-500 mb-10">Gestione las imágenes de su catálogo</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 mb-12 max-w-xs">
        <div className="bg-white rounded-sm border border-stone-100 p-6 shadow-sm">
          <div className="text-2xl mb-3">🖼️</div>
          <div className="font-serif text-4xl font-bold text-stone-900 mb-1">{totalItems ?? 0}</div>
          <div className="font-sans text-sm text-stone-500">Imágenes subidas</div>
        </div>
      </div>

      {/* Storage usage */}
      <div className="bg-white rounded-sm border border-stone-100 p-6 shadow-sm mb-12">
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans text-sm font-medium text-stone-700">Almacenamiento de imágenes</span>
          <span className="font-sans text-sm text-stone-500">{usedMB} MB / {limitMB.toFixed(1)} MB</span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-amber-400' : 'bg-wood-500'}`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {/* Quick access */}
      <h2 className="font-serif text-xl font-semibold text-stone-900 mb-5">Acceso rápido por categoría</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            href={`/admin/${cat.slug}`}
            className="bg-white border border-stone-100 hover:border-wood-200 hover:shadow-sm rounded-sm p-4 transition-all group"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-sans text-sm font-medium text-stone-700 group-hover:text-wood-700 transition-colors leading-tight">
                {cat.name}
              </p>
              <span className="font-sans text-xs font-semibold text-wood-700 bg-wood-50 px-1.5 py-0.5 rounded-sm shrink-0">
                {slugToCount[cat.slug] ?? 0}
              </span>
            </div>
            <p className="font-sans text-xs text-stone-400">Gestionar →</p>
          </Link>
        ))}
      </div>

      {/* Recent items */}
      {recentItems && recentItems.length > 0 && (
        <>
          <h2 className="font-serif text-xl font-semibold text-stone-900 mb-5">Últimas imágenes subidas</h2>
          <div className="bg-white border border-stone-100 rounded-sm shadow-sm overflow-hidden">
            <table className="w-full font-sans text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  <th className="text-left px-5 py-3 text-stone-500 font-medium">Título</th>
                  <th className="text-left px-5 py-3 text-stone-500 font-medium">Categoría</th>
                  <th className="text-left px-5 py-3 text-stone-500 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {recentItems.map(item => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3 text-stone-700">{item.title ?? '(sin título)'}</td>
                    <td className="px-5 py-3 text-stone-500">
                      {(item.category as { name: string; slug: string } | null)?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-stone-400">
                      {new Date(item.created_at).toLocaleDateString('es-UY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
