'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES } from '@/lib/constants'

const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
)

const ExternalIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const NavContent = ({ onNav }: { onNav?: () => void }) => (
    <>
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            onClick={onNav}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm font-sans text-sm font-medium transition-colors ${
              pathname === '/admin'
                ? 'bg-wood-50 text-wood-700'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <DashboardIcon />
            Dashboard
          </Link>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold text-stone-400 uppercase tracking-widest px-3 mb-2">
            Categorías
          </p>
          <div className="space-y-0.5">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/admin/${cat.slug}`}
                onClick={onNav}
                className={`block px-3 py-2 rounded-sm font-sans text-sm transition-colors ${
                  pathname === `/admin/${cat.slug}`
                    ? 'bg-wood-50 text-wood-700 font-medium'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-stone-100 space-y-1">
        <Link
          href="/"
          target="_blank"
          onClick={onNav}
          className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ExternalIcon />
          Ver sitio web
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 font-sans text-sm text-stone-500 hover:text-red-600 w-full transition-colors"
        >
          <LogoutIcon />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-stone-100 flex items-center justify-between px-4">
        <Link href="/admin" className="flex flex-col leading-tight">
          <span className="font-serif text-sm font-bold text-stone-900">Muebles Rústicos</span>
          <span className="font-sans text-xs text-wood-600 tracking-widest uppercase leading-none">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-stone-950/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative w-72 max-w-[85vw] bg-white flex flex-col h-full shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-stone-100">
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex flex-col leading-tight">
                <span className="font-serif text-base font-bold text-stone-900">Muebles Rústicos</span>
                <span className="font-sans text-xs text-wood-600 tracking-widest uppercase">Panel de administración</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors"
                aria-label="Cerrar menú"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <NavContent onNav={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-stone-100 flex-col h-screen overflow-y-auto shrink-0">
        <div className="p-6 border-b border-stone-100">
          <Link href="/admin" className="flex flex-col leading-tight">
            <span className="font-serif text-base font-bold text-stone-900">Muebles Rústicos</span>
            <span className="font-sans text-xs text-wood-600 tracking-widest uppercase">Panel de administración</span>
          </Link>
        </div>
        <NavContent />
      </aside>
    </>
  )
}
