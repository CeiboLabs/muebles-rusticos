import Link from 'next/link'
import Image from 'next/image'
import { CONTACT_INFO, SITE_NAME } from '@/lib/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="container-max section-padding py-12">

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">

          {/* Brand */}
          <div className="shrink-0">
            <Link href="/" className="inline-block mb-4" aria-label="Ir al inicio - Muebles Rústicos Solymar">
              <Image
                src="/images/logo-transparent.png"
                alt={SITE_NAME}
                width={150}
                height={48}
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="font-sans text-sm text-stone-400 leading-relaxed whitespace-nowrap">
              Artesanía uruguaya desde 1994.<br />
              +30 años fabricando muebles a medida.
            </p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">

            {/* Horario */}
            <div>
              <p className="font-sans text-xs font-semibold tracking-widest uppercase text-stone-500 mb-3">
                Horario
              </p>
              <ul className="space-y-1">
                <li className="flex gap-3 justify-between">
                  <span>Lun – Vie</span>
                  <span className="font-sans text-stone-300">8:30–17:30</span>
                </li>
                <li className="flex gap-3 justify-between">
                  <span>Sábado</span>
                  <span className="font-sans text-stone-300">9:00–13:00</span>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <p className="font-sans text-xs font-semibold tracking-widest uppercase text-stone-500 mb-3">
                Contacto
              </p>
              <ul className="space-y-1.5">
                <li>
                  <a href={`tel:${CONTACT_INFO.phone1.replace(/\s/g,'')}`} className="font-sans hover:text-wood-400 transition-colors">
                    {CONTACT_INFO.phone1}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-wood-400 transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </li>
                <li className="text-stone-400 text-xs leading-snug">
                  {CONTACT_INFO.addressShort}
                </li>
              </ul>
            </div>

            {/* Nav */}
            <div>
              <p className="font-sans text-xs font-semibold tracking-widest uppercase text-stone-500 mb-3">
                Páginas
              </p>
              <ul className="space-y-1.5">
                {[
                  { href: '/catalogo', label: 'Catálogo' },
                  { href: '/nosotros', label: 'Nosotros' },
                  { href: '/contacto', label: 'Contacto' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-wood-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-sans text-xs text-stone-400">
            © {year} {SITE_NAME}
          </p>
          <p className="font-sans text-xs text-stone-400">
            Desarrollado por{' '}
            <a
              href="https://ceibolabs.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-stone-300 hover:text-wood-400 transition-colors"
            >
              Ceibo Labs
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
