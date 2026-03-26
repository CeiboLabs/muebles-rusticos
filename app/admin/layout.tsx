import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Root admin layout — route groups (auth) and (dashboard) have their own layouts
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
