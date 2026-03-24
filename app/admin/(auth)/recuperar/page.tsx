'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export default function RecuperarPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin/nueva-contrasena`,
    })

    if (resetError) {
      setError('No se pudo enviar el correo. Verifique el email ingresado.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  const inputClass =
    'w-full px-4 py-3.5 border border-stone-200 font-sans text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-wood-400 focus:ring-1 focus:ring-wood-400 transition-colors bg-white'

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
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
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="font-serif text-xl font-semibold text-stone-900 mb-2">Correo enviado</h1>
              <p className="font-sans text-sm text-stone-500">
                Revisá tu bandeja de entrada. El link expira en 1 hora.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-1">
                Recuperar contraseña
              </h1>
              <p className="font-sans text-sm text-stone-500 mb-7">
                Ingrese su email y le enviaremos un link para restablecer su contraseña.
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

                {error && (
                  <div className="bg-red-50 border border-red-200 px-4 py-3">
                    <p className="font-sans text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/admin/login" className="font-sans text-xs text-stone-400 hover:text-stone-600 transition-colors">
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
