import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24">
        <section className="min-h-[70vh] flex items-center bg-stone-50">
          <div className="container-max section-padding w-full py-24">
            <div className="max-w-xl">
              <span className="eyebrow mb-6 inline-flex">Error 404</span>
              <div className="font-serif text-[10rem] font-bold leading-none text-wood-100 select-none -ml-2">
                404
              </div>
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-stone-900 mb-4 -mt-6">
                Página no encontrada
              </h1>
              <p className="font-sans text-stone-500 text-lg font-light mb-10 leading-relaxed">
                La dirección que buscás no existe o fue movida.<br />
                Podés navegar desde aquí hacia donde necesitás.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/" className="btn-primary px-8 py-3.5 text-sm">
                  Ir al inicio
                </Link>
                <Link href="/catalogo" className="btn-secondary px-8 py-3.5 text-sm">
                  Ver catálogo
                </Link>
                <Link href="/contacto" className="btn-ghost px-8 py-3.5 text-sm">
                  Contacto
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
