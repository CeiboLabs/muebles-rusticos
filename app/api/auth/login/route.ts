import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const WINDOW_TTL_SECONDS = 15 * 60

// Fallback for local dev (KV not available outside Cloudflare runtime)
const devFallback = new Map<string, { count: number; firstAttempt: number }>()

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}

interface RateLimitRecord { count: number; firstAttempt: number }

async function getKV(): Promise<{ get(k: string): Promise<string | null>; put(k: string, v: string, o: { expirationTtl: number }): Promise<void> } | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getCloudflareContext } = require('@opennextjs/cloudflare')
    const ctx = getCloudflareContext()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (ctx?.env as any)?.RATE_LIMITS ?? null
  } catch {
    return null
  }
}

async function isRateLimited(ip: string): Promise<boolean> {
  const key = `rl:${ip}`
  const now = Date.now()
  const kv = await getKV()

  if (kv) {
    const raw = await kv.get(key)
    if (!raw) return false
    const record: RateLimitRecord = JSON.parse(raw)
    if (now - record.firstAttempt >= WINDOW_MS) return false
    return record.count >= MAX_ATTEMPTS
  }

  // Dev fallback
  const record = devFallback.get(key)
  if (!record || now - record.firstAttempt >= WINDOW_MS) return false
  return record.count >= MAX_ATTEMPTS
}

async function recordFailedAttempt(ip: string): Promise<void> {
  const key = `rl:${ip}`
  const now = Date.now()
  const kv = await getKV()

  if (kv) {
    const raw = await kv.get(key)
    const record: RateLimitRecord = raw
      ? JSON.parse(raw)
      : { count: 0, firstAttempt: now }
    if (now - record.firstAttempt >= WINDOW_MS) {
      record.count = 1
      record.firstAttempt = now
    } else {
      record.count++
    }
    await kv.put(key, JSON.stringify(record), { expirationTtl: WINDOW_TTL_SECONDS })
    return
  }

  // Dev fallback
  const record = devFallback.get(key)
  if (!record || now - record.firstAttempt >= WINDOW_MS) {
    devFallback.set(key, { count: 1, firstAttempt: now })
  } else {
    record.count++
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)

  if (await isRateLimited(ip)) {
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
    await recordFailedAttempt(ip)
    return NextResponse.json(
      { error: 'Email o contraseña incorrectos. Por favor verifique sus datos.' },
      { status: 401 }
    )
  }

  return NextResponse.json({ success: true })
}
