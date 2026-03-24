'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

const requirements = [
  { label: 'Mínimo 8 caracteres', test: (p: string) => p.length >= 8 },
  { label: 'Una letra mayúscula', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Una letra minúscula', test: (p: string) => /[a-z]/.test(p) },
  { label: 'Un número',           test: (p: string) => /[0-9]/.test(p) },
]

function validatePassword(password: string): string | null {
  for (const req of requirements) {
    if (!req.test(password)) return `La contraseña debe tener ${req.label.toLowerCase()}.`
  }
  return null
}

export default function NuevaContrasenaPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm
  const passwordsMismatch = confirm.length > 0 && password !== confirm

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const validationError = validatePassword(password)
    if (validationError) { setError(validationError); return }
    if (!passwordsMatch) { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('No se pudo actualizar la contraseña. El link puede haber expirado.')
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    router.push('/admin/login')
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
          <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-1">
            Nueva contraseña
          </h1>
          <p className="font-sans text-sm text-stone-500 mb-7">
            Elija una contraseña segura para su cuenta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                Nueva contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass}
              />
              {password.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {requirements.map(req => (
                    <li key={req.label} className={`flex items-center gap-1.5 font-sans text-xs ${req.test(password) ? 'text-green-600' : 'text-stone-400'}`}>
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {req.test(password)
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        }
                      </svg>
                      {req.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="confirm" className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirm"
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={`${inputClass} ${passwordsMatch ? 'border-green-400 ring-1 ring-green-400' : passwordsMismatch ? 'border-red-300' : ''}`}
              />
              {passwordsMatch && (
                <p className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-green-600">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Las contraseñas coinciden
                </p>
              )}
              {passwordsMismatch && (
                <p className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-red-500">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 px-4 py-3">
                <p className="font-sans text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar contraseña'}
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
