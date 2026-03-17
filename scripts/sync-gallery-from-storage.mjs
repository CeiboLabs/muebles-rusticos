/**
 * Sincroniza gallery_items desde Supabase Storage.
 * Lee los archivos ya subidos al bucket "gallery" y crea los registros
 * en gallery_items con las URLs públicas correctas.
 * No elimina ni sobreescribe nada.
 *
 * Uso:
 *   node --env-file=.env.local scripts/sync-gallery-from-storage.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Faltan variables de entorno.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

const CATEGORIES = [
  { slug: 'comedores',         name: 'Comedores' },
  { slug: 'living',            name: 'Living' },
  { slug: 'dormitorios',       name: 'Dormitorios' },
  { slug: 'dormitorios-ninos', name: 'Dormitorios de Niños' },
  { slug: 'banos-y-cocinas',   name: 'Baños y Cocinas' },
  { slug: 'barbacoas',         name: 'Barbacoas' },
  { slug: 'escritorios',       name: 'Escritorios y Oficinas' },
  { slug: 'exterior',          name: 'Muebles de Exterior' },
  { slug: 'hierro-y-madera',   name: 'Hierro y Madera' },
  { slug: 'tapiceria',         name: 'Tapicería' },
  { slug: 'pergolas-y-decks',  name: 'Pérgolas y Decks' },
  { slug: 'decoracion',        name: 'Decoración' },
]

function titleFromFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, '')     // quita extensión
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

async function getCategoryMap() {
  const map = {}
  for (const cat of CATEGORIES) {
    const { data } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', cat.slug)
      .single()
    if (data) map[cat.slug] = data.id
    else console.warn(`⚠️  Sin categoría en BD para: ${cat.slug}`)
  }
  return map
}

async function getExistingUrls() {
  const { data } = await supabase.from('gallery_items').select('image_url')
  return new Set((data ?? []).map(r => r.image_url))
}

async function listAllFiles(folder) {
  const files = []
  let offset = 0
  const limit = 1000

  while (true) {
    const { data, error } = await supabase.storage
      .from('gallery')
      .list(folder, { limit, offset })

    if (error) {
      console.error(`❌  Error listando ${folder}: ${error.message}`)
      break
    }
    if (!data || data.length === 0) break

    files.push(...data.filter(f => f.name && /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f.name)))
    if (data.length < limit) break
    offset += limit
  }

  return files
}

async function main() {
  console.log('🚀  Sincronizando gallery_items desde Supabase Storage...\n')

  const categoryMap = await getCategoryMap()
  const existingUrls = await getExistingUrls()
  console.log(`   ${existingUrls.size} registros ya en BD.\n`)

  let inserted = 0
  let skipped  = 0
  let errors   = 0

  for (const cat of CATEGORIES) {
    const categoryId = categoryMap[cat.slug]
    if (!categoryId) continue

    const files = await listAllFiles(cat.slug)
    console.log(`📁  ${cat.slug} (${files.length} archivos en Storage)`)

    for (const file of files) {
      const storagePath = `${cat.slug}/${file.name}`
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(storagePath)

      if (existingUrls.has(publicUrl)) {
        skipped++
        continue
      }

      const { error } = await supabase.from('gallery_items').insert({
        category_id: categoryId,
        title:       titleFromFilename(file.name),
        image_url:   publicUrl,
      })

      if (error) {
        console.error(`   ❌  ${file.name}: ${error.message}`)
        errors++
      } else {
        console.log(`   ✅  ${file.name}`)
        inserted++
      }
    }
    console.log('')
  }

  console.log('─'.repeat(50))
  console.log(`✅  Insertados: ${inserted}`)
  console.log(`⏭   Saltados:  ${skipped}`)
  console.log(`❌  Errores:   ${errors}`)
  console.log('─'.repeat(50))
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
