'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PasswordInput from '@/components/admin/PasswordInput'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Error al iniciar sesión.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const inputClass =
    'w-full px-4 py-3.5 border border-stone-200 font-sans text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-wood-400 focus:ring-1 focus:ring-wood-400 transition-colors bg-white'

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Image
            src="/images/logo-transparent.png"
            alt="Muebles Rústicos Solymar"
            width={220}
            height={70}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>

        <div className="bg-white border border-stone-100 shadow-sm p-8">
          <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-1">
            Panel de administración
          </h1>
          <p className="font-sans text-sm text-stone-500 mb-7">
            Ingrese con su email y contraseña
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="su@email.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                Contraseña
              </label>
              <PasswordInput
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className={inputClass}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-3">
                <p className="font-sans text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <Link href="/admin/recuperar" className="font-sans text-xs text-stone-400 hover:text-stone-600 transition-colors">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Ingresando...
                </span>
              ) : 'Ingresar'}
            </button>
          </form>
        </div>

        <p className="text-center font-sans text-xs text-stone-400 mt-6">
          mueblesrusticos.com.uy
        </p>
      </div>
    </div>
  )
}
