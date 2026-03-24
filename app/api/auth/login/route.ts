import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// In-memory rate limiter — resets on restart, suitable for single-instance deployments
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record || now - record.firstAttempt >= WINDOW_MS) {
    loginAttempts.set(ip, { count: 0, firstAttempt: now })
    return false
  }

  return record.count >= MAX_ATTEMPTS
}

function recordFailedAttempt(ip: string) {
  const now = Date.now()
  const record = loginAttempts.get(ip)
  if (record) {
    record.count++
  } else {
    loginAttempts.set(ip, { count: 1, firstAttempt: now })
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos fallidos. Intente de nuevo en 15 minutos.' },
      { status: 429 }
    )
  }

  const body = await request.json()
  const { email, password } = body as {
    email: string
    password: string
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email y contraseña son requeridos.' },
      { status: 400 }
    )
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    recordFailedAttempt(ip)
    return NextResponse.json(
      { error: 'Email o contraseña incorrectos. Por favor verifique sus datos.' },
      { status: 401 }
    )
  }

  return NextResponse.json({ success: true })
}
