import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-stone-900">

      {/* Background image — main banner photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/banner-living-1.jpg"
          alt="Muebles Rústicos Solymar — Living"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/60 to-stone-950/20" />
      </div>

      {/* Content */}
      <div className="container-max section-padding relative z-10 py-24">
        <div className="max-w-2xl">
          <span className="eyebrow text-stone-300/90 mb-6 inline-flex">
            Artesanía uruguaya desde 1994
          </span>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-6 tracking-tight">
            Los muebles de<br />
            <span className="text-wood-300 italic">tus sueños</span>
          </h1>

          <p className="font-sans text-lg text-stone-300 leading-relaxed mb-10 max-w-lg font-light">
            En Muebles Rústicos Solymar creamos los muebles de tus sueños
            y los que no los inventamos. Madera maciza, diseño a medida, calidad para siempre.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/catalogo" className="btn-primary px-8 py-4">
              Ver catálogo
            </Link>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 animate-bounce">
        <span className="font-sans text-xs font-medium tracking-widest uppercase text-white/50">
          Scroll
        </span>
        <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
