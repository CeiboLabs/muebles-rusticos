import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="text-center max-w-md">
        <div className="font-serif text-8xl font-bold text-wood-200 mb-4">404</div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-3">Página no encontrada</h1>
        <p className="font-sans text-stone-500 mb-8">
          La página que busca no existe o fue movida.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">Ir al inicio</Link>
          <Link href="/catalogo" className="btn-secondary">Ver catálogo</Link>
        </div>
      </div>
    </div>
  )
}
