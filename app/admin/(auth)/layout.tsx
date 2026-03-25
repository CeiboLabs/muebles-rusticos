import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceso | Panel Administrativo',
  robots: { index: false, follow: false },
}

// Auth group — no sidebar, just the page
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
