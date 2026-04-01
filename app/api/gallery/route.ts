import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Must match GALLERY_PAGE_SIZE in GalleryGrid
const PAGE_SIZE = 24

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const categoryId = parseInt(searchParams.get('categoryId') ?? '0', 10)
    const page = parseInt(searchParams.get('page') ?? '2', 10)

    if (!categoryId) return NextResponse.json({ error: 'Missing categoryId' }, { status: 400 })

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('gallery_items')
      .select('id, image_url, title, created_at, category_id')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('[/api/gallery]', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data ?? [])
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/gallery]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
