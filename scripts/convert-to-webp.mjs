/**
 * Conversión de imágenes existentes en Supabase Storage a WebP
 *
 * Requisitos:
 *   - NEXT_PUBLIC_SUPABASE_URL en .env.local
 *   - SUPABASE_SERVICE_ROLE_KEY en .env.local
 *   - npm install --save-dev sharp (ya instalado)
 *
 * Uso:
 *   node --env-file=.env.local scripts/convert-to-webp.mjs
 *
 * Qué hace:
 *   1. Lee todas las imágenes de gallery_items y categories (cover_image_url)
 *   2. Descarga cada imagen que NO sea ya WebP
 *   3. La convierte a WebP (calidad 85)
 *   4. La re-sube a Supabase Storage con extensión .webp
 *   5. Actualiza la URL en la base de datos
 *   6. Elimina el archivo original
 */

import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const WEBP_QUALITY = 85
const MAX_DIMENSION = 1920

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Faltan variables de entorno.')
  console.error('   Necesitás NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

/** Extrae el storage path desde una URL pública de Supabase */
function storagePathFromUrl(publicUrl) {
  // URL format: https://<project>.supabase.co/storage/v1/object/public/gallery/<path>
  const marker = '/object/public/gallery/'
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return publicUrl.slice(idx + marker.length)
}

/** Descarga un archivo de Supabase Storage como Buffer */
async function downloadImage(storagePath) {
  const { data, error } = await supabase.storage
    .from('gallery')
    .download(storagePath)

  if (error) throw new Error(`Download error: ${error.message}`)
  const arrayBuffer = await data.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/** Convierte un Buffer a WebP usando sharp */
async function convertToWebP(buffer) {
  return sharp(buffer)
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer()
}

/** Sube un Buffer a Supabase Storage */
async function uploadWebP(storagePath, buffer) {
  const { error } = await supabase.storage
    .from('gallery')
    .upload(storagePath, buffer, {
      contentType: 'image/webp',
      upsert: true,
    })
  if (error) throw new Error(`Upload error: ${error.message}`)
}

/** Elimina un archivo de Supabase Storage */
async function deleteFile(storagePath) {
  const { error } = await supabase.storage
    .from('gallery')
    .remove([storagePath])
  if (error) console.warn(`   ⚠️  No se pudo eliminar ${storagePath}: ${error.message}`)
}

/** Devuelve la URL pública de un storage path */
function getPublicUrl(storagePath) {
  const { data } = supabase.storage.from('gallery').getPublicUrl(storagePath)
  return data.publicUrl
}

/** Procesa una imagen: descarga → convierte → sube → devuelve nueva URL */
async function processImage(originalUrl) {
  const oldPath = storagePathFromUrl(originalUrl)
  if (!oldPath) {
    console.warn(`   ⚠️  URL no reconocida: ${originalUrl}`)
    return null
  }

  const isAlreadyWebP = oldPath.toLowerCase().endsWith('.webp')
  if (isAlreadyWebP) return 'SKIP'

  // Generar nuevo path con extensión .webp
  const newPath = oldPath.replace(/\.[^/.]+$/, '') + '.webp'

  const buffer = await downloadImage(oldPath)
  const webpBuffer = await convertToWebP(buffer)
  await uploadWebP(newPath, webpBuffer)

  const newUrl = getPublicUrl(newPath)

  // Si el path cambió (extensión diferente), eliminar el original
  if (oldPath !== newPath) {
    await deleteFile(oldPath)
  }

  return newUrl
}

async function main() {
  console.log('🚀  Iniciando conversión a WebP...\n')

  let converted = 0
  let skipped   = 0
  let errors    = 0

  // ── 1. Gallery items ──────────────────────────────────────────────────────
  console.log('📷  Procesando gallery_items...')
  const { data: items, error: itemsError } = await supabase
    .from('gallery_items')
    .select('id, image_url')

  if (itemsError) {
    console.error('❌  Error consultando gallery_items:', itemsError.message)
    process.exit(1)
  }

  for (const item of items) {
    const oldUrl = item.image_url
    const oldPath = storagePathFromUrl(oldUrl) ?? oldUrl

    process.stdout.write(`   ${oldPath} → `)

    try {
      const newUrl = await processImage(oldUrl)

      if (newUrl === 'SKIP') {
        console.log('ya es WebP ⏭')
        skipped++
        continue
      }

      if (!newUrl) {
        console.log('URL no reconocida ⚠️')
        errors++
        continue
      }

      // Actualizar DB
      const { error: dbError } = await supabase
        .from('gallery_items')
        .update({ image_url: newUrl })
        .eq('id', item.id)

      if (dbError) throw new Error(dbError.message)

      console.log('✅')
      converted++
    } catch (err) {
      console.log(`❌  ${err.message}`)
      errors++
    }
  }

  // ── 2. Categories cover images ────────────────────────────────────────────
  console.log('\n📂  Procesando categorías (cover_image_url)...')
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, slug, cover_image_url')
    .not('cover_image_url', 'is', null)

  if (catError) {
    console.error('❌  Error consultando categories:', catError.message)
  } else {
    for (const cat of categories) {
      const oldUrl = cat.cover_image_url
      const oldPath = storagePathFromUrl(oldUrl) ?? oldUrl

      process.stdout.write(`   [${cat.slug}] ${oldPath} → `)

      try {
        const newUrl = await processImage(oldUrl)

        if (newUrl === 'SKIP') {
          console.log('ya es WebP ⏭')
          skipped++
          continue
        }

        if (!newUrl) {
          console.log('URL no reconocida ⚠️')
          errors++
          continue
        }

        const { error: dbError } = await supabase
          .from('categories')
          .update({ cover_image_url: newUrl })
          .eq('id', cat.id)

        if (dbError) throw new Error(dbError.message)

        console.log('✅')
        converted++
      } catch (err) {
        console.log(`❌  ${err.message}`)
        errors++
      }
    }
  }

  // ── Resumen ───────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(50))
  console.log(`✅  Convertidas: ${converted}`)
  console.log(`⏭   Ya WebP:    ${skipped}`)
  console.log(`❌  Errores:    ${errors}`)
  console.log('─'.repeat(50))

  if (errors > 0) {
    console.log('\n⚠️  Algunas imágenes fallaron. Podés volver a ejecutar el script — las ya convertidas se saltarán automáticamente.')
  } else {
    console.log('\n✔  Todas las imágenes están ahora en WebP.')
  }
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
