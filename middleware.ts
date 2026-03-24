import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const SECONDARY_DOMAINS = ['mueblesrusticos.uy', 'www.mueblesrusticos.uy']
const CANONICAL_ORIGIN = 'https://mueblesrusticos.com.uy'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''

  if (SECONDARY_DOMAINS.includes(host)) {
    const destination = `${CANONICAL_ORIGIN}${request.nextUrl.pathname}${request.nextUrl.search}`
    return NextResponse.redirect(destination, { status: 301 })
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
