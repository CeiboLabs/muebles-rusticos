/**
 * Migración de imágenes locales → Supabase Storage + gallery_items
 *
 * Requisito: agregar SUPABASE_SERVICE_ROLE_KEY en .env.local
 * (la encontrás en Supabase Dashboard → Project Settings → API → service_role)
 *
 * Uso:
 *   node --env-file=.env.local scripts/migrate-gallery.mjs
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const GALLERY_DIR = path.join(ROOT, 'public', 'images', 'gallery')

// --- Config ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Faltan variables de entorno.')
  console.error('   Asegurate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// Categorías definidas en el proyecto (slug → nombre)
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

function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase()
  const map = {
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png':  'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.gif':  'image/gif',
  }
  return map[ext] ?? 'application/octet-stream'
}

function titleFromFilename(filename) {
  return path.basename(filename, path.extname(filename))
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

async function ensureCategories() {
  const categoryMap = {}

  for (const cat of CATEGORIES) {
    // Upsert: insert if not exists, return existing id if it does
    const { data, error } = await supabase
      .from('categories')
      .upsert({ slug: cat.slug, name: cat.name }, { onConflict: 'slug', ignoreDuplicates: false })
      .select('id, slug')
      .single()

    if (error) {
      // Maybe already exists — try to fetch
      const { data: existing, error: fetchError } = await supabase
        .from('categories')
        .select('id, slug')
        .eq('slug', cat.slug)
        .single()

      if (fetchError || !existing) {
        console.error(`❌  No se pudo obtener/crear categoría "${cat.slug}": ${error.message}`)
        continue
      }
      categoryMap[cat.slug] = existing.id
    } else {
      categoryMap[cat.slug] = data.id
    }
  }

  return categoryMap
}

async function getExistingPaths() {
  // Fetch all existing image_urls to avoid duplicates
  const { data, error } = await supabase.from('gallery_items').select('image_url')
  if (error) {
    console.error('❌  Error consultando gallery_items:', error.message)
    return new Set()
  }
  return new Set((data ?? []).map(r => r.image_url))
}

async function main() {
  console.log('🚀  Iniciando migración...\n')

  // 1. Ensure categories exist in DB
  console.log('📂  Verificando categorías en BD...')
  const categoryMap = await ensureCategories()
  console.log(`   ${Object.keys(categoryMap).length} categorías listas.\n`)

  // 2. Get already-uploaded URLs
  const existingUrls = await getExistingPaths()
  console.log(`   ${existingUrls.size} imágenes ya en BD.\n`)

  // 3. Walk gallery folders
  const folders = fs.readdirSync(GALLERY_DIR).filter(f =>
    fs.statSync(path.join(GALLERY_DIR, f)).isDirectory()
  )

  let uploaded = 0
  let skipped  = 0
  let errors   = 0

  for (const folder of folders) {
    const categoryId = categoryMap[folder]
    if (!categoryId) {
      console.warn(`⚠️   Sin categoría en BD para carpeta: ${folder}`)
      continue
    }

    const folderPath = path.join(GALLERY_DIR, folder)
    const files = fs.readdirSync(folderPath).filter(f =>
      /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f)
    )

    console.log(`📁  ${folder} (${files.length} imágenes)`)

    for (const file of files) {
      const filePath    = path.join(folderPath, file)
      const storagePath = `${folder}/${file}`
      const stats       = fs.statSync(filePath)

      // Upload to storage
      const fileBuffer = fs.readFileSync(filePath)
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(storagePath, fileBuffer, {
          contentType: getContentType(file),
          upsert: false,
        })

      if (uploadError) {
        const alreadyExists =
          uploadError.message.toLowerCase().includes('already exists') ||
          uploadError.statusCode === '409' ||
          uploadError.error === 'Duplicate'

        if (!alreadyExists) {
          console.error(`   ❌  Upload error ${storagePath}: ${uploadError.message}`)
          errors++
          continue
        }
        // File already in storage — still check if DB record exists
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(storagePath)

      // Skip if already in DB
      if (existingUrls.has(publicUrl)) {
        console.log(`   ⏭   Ya existe: ${file}`)
        skipped++
        continue
      }

      // Insert DB record
      const { error: dbError } = await supabase.from('gallery_items').insert({
        category_id: categoryId,
        title:       titleFromFilename(file),
        image_url:   publicUrl,
        size_bytes:  stats.size,
      })

      if (dbError) {
        console.error(`   ❌  DB error ${storagePath}: ${dbError.message}`)
        errors++
      } else {
        console.log(`   ✅  ${file}`)
        uploaded++
      }
    }
    console.log('')
  }

  console.log('─'.repeat(50))
  console.log(`✅  Subidas:  ${uploaded}`)
  console.log(`⏭   Saltadas: ${skipped}`)
  console.log(`❌  Errores:  ${errors}`)
  console.log('─'.repeat(50))
  console.log('\nMigración completada.')
  console.log('Podés borrar /public/images/gallery/ una vez que verifiques que todo está en Supabase.')
}

main().catch(err => {
  console.error('Error fatal:', err)
  process.exit(1)
})
