/**
 * Actualiza size_bytes en gallery_items con el tamaño real de los archivos en storage.
 * Útil después de convertir imágenes a WebP (el script convert-to-webp no actualizaba este campo).
 *
 * Uso:
 *   node --env-file=.env.local scripts/fix-size-bytes.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Faltan variables de entorno.')
  console.error('   Necesitás NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

const CATEGORY_SLUGS = [
  'comedores', 'living', 'dormitorios', 'dormitorios-ninos',
  'banos-y-cocinas', 'barbacoas', 'escritorios', 'exterior',
  'hierro-y-madera', 'tapiceria', 'pergolas-y-decks', 'decoracion',
]

/** Extrae el storage path desde una URL pública de Supabase */
function storagePathFromUrl(publicUrl) {
  const marker = '/object/public/gallery/'
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return publicUrl.slice(idx + marker.length)
}

/** Lista todos los archivos de una carpeta en storage y devuelve un map path→size */
async function listFolder(folder) {
  const map = {}
  const { data, error } = await supabase.storage
    .from('gallery')
    .list(folder, { limit: 1000 })

  if (error) {
    console.warn(`   ⚠️  No se pudo listar ${folder}: ${error.message}`)
    return map
  }

  for (const file of data ?? []) {
    if (file.metadata?.size) {
      map[`${folder}/${file.name}`] = file.metadata.size
    }
  }
  return map
}

async function main() {
  console.log('🔍  Leyendo tamaños reales desde Supabase Storage...\n')

  // Construir mapa completo path → size
  const sizeMap = {}
  for (const slug of CATEGORY_SLUGS) {
    const folderMap = await listFolder(slug)
    Object.assign(sizeMap, folderMap)
  }
  // También listar raíz por si hay archivos sin subcarpeta
  const rootMap = await listFolder('')
  Object.assign(sizeMap, rootMap)

  const totalFiles = Object.keys(sizeMap).length
  console.log(`   ${totalFiles} archivos encontrados en storage\n`)

  // Obtener todos los gallery_items
  const { data: items, error: itemsError } = await supabase
    .from('gallery_items')
    .select('id, image_url, size_bytes')
    .not('image_url', 'is', null)

  if (itemsError) {
    console.error('❌  Error consultando gallery_items:', itemsError.message)
    process.exit(1)
  }

  console.log(`📦  ${items.length} items en gallery_items\n`)

  let updated = 0
  let notFound = 0
  let errors = 0

  for (const item of items) {
    const path = storagePathFromUrl(item.image_url)
    if (!path) {
      console.log(`   ⚠️  URL no reconocida: ${item.image_url}`)
      notFound++
      continue
    }

    const realSize = sizeMap[path]
    if (realSize === undefined) {
      console.log(`   ⚠️  No encontrado en storage: ${path}`)
      notFound++
      continue
    }

    if (realSize === item.size_bytes) {
      continue // ya está correcto, no tocar
    }

    const { error: dbError } = await supabase
      .from('gallery_items')
      .update({ size_bytes: realSize })
      .eq('id', item.id)

    if (dbError) {
      console.log(`   ❌  ${path}: ${dbError.message}`)
      errors++
    } else {
      const oldMB = ((item.size_bytes ?? 0) / 1024 / 1024).toFixed(2)
      const newMB = (realSize / 1024 / 1024).toFixed(2)
      console.log(`   ✅  ${path}  ${oldMB} MB → ${newMB} MB`)
      updated++
    }
  }

  console.log('\n' + '─'.repeat(50))
  console.log(`✅  Actualizados: ${updated}`)
  console.log(`⚠️  No encontrados: ${notFound}`)
  console.log(`❌  Errores: ${errors}`)
  console.log('─'.repeat(50))
  console.log('\n✔  Listo. Recargá el dashboard para ver el nuevo valor.')
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
