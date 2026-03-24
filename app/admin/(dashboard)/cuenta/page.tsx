'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PasswordInput from '@/components/admin/PasswordInput'

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

export default function CuentaPage() {
  const router = useRouter()
  const [current, setCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm
  const passwordsMismatch = confirm.length > 0 && password !== confirm

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const validationError = validatePassword(password)
    if (validationError) { setError(validationError); return }
    if (!passwordsMatch) { setError('Las contraseñas nuevas no coinciden.'); return }

    setShowConfirm(true)
  }

  async function handleConfirm() {
    setShowConfirm(false)
    setLoading(true)

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      setError('No se pudo verificar su sesión. Vuelva a iniciar sesión.')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: current,
    })

    if (signInError) {
      setError('La contraseña actual es incorrecta.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('No se pudo actualizar la contraseña. Intente de nuevo.')
      setLoading(false)
      return
    }

    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const inputClass =
    'w-full px-4 py-3 border border-stone-200 font-sans text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-wood-400 focus:ring-1 focus:ring-wood-400 transition-colors bg-white'

  return (
    <div className="p-6 md:p-10 max-w-md">
      <h1 className="font-serif text-2xl font-semibold text-stone-900 mb-1">Mi cuenta</h1>
      <p className="font-sans text-sm text-stone-500 mb-8">Cambie su contraseña de acceso al panel.</p>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="current" className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
            Contraseña actual
          </label>
          <PasswordInput
            id="current"
            required
            autoComplete="current-password"
            value={current}
            onChange={e => setCurrent(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-sans text-xs font-semibold uppercase tracking-widest text-stone-500 mb-2">
            Nueva contraseña
          </label>
          <PasswordInput
            id="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
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
            Confirmar nueva contraseña
          </label>
          <PasswordInput
            id="confirm"
            required
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
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
          className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Guardar contraseña'}
        </button>
      </form>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-stone-950/50" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white border border-stone-100 shadow-xl p-8 max-w-sm w-full">
            <h2 className="font-serif text-xl font-semibold text-stone-900 mb-2">
              ¿Confirmar cambio?
            </h2>
            <p className="font-sans text-sm text-stone-500 mb-6">
              Se actualizará su contraseña y deberá volver a iniciar sesión.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-stone-200 font-sans text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-wood-600 text-white font-sans text-sm hover:bg-wood-700 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
