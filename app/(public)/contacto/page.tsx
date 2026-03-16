import type { Metadata } from 'next'
import { CONTACT_INFO, BUSINESS_HOURS, SITE_NAME, SITE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Contáctenos por teléfono, WhatsApp o email. ${SITE_NAME}, Av. Giannattasio Km 23, Solymar, Uruguay.`,
  alternates: { canonical: `${SITE_URL}/contacto` },
}

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

export default function ContactoPage() {
  return (
    <>
      {/* Page header */}
      <section className="py-16 bg-stone-50 border-b border-stone-100">
        <div className="container-max section-padding">
          <span className="eyebrow mb-5 inline-flex">Estamos para ayudarle</span>
          <h1 className="font-serif text-5xl font-bold text-stone-900 mb-4">Contacto</h1>
          <p className="font-sans text-stone-600 max-w-xl">
            Comuníquese con nosotros por cualquiera de los medios disponibles.
            Respondemos a la brevedad.
          </p>
        </div>
      </section>

      {/* Main contact section */}
      <section className="py-16 bg-white">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Left — primary CTAs + contact details */}
            <div className="space-y-10">

              {/* Primary CTAs */}
              <div className="space-y-4">
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hola%2C%20quisiera%20hacer%20una%20consulta`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full justify-center py-4 text-sm"
                >
                  <WhatsAppIcon />
                  Escribir por WhatsApp — <span className="lining-nums">{CONTACT_INFO.whatsappDisplay}</span>
                </a>
                <a
                  href={`tel:${CONTACT_INFO.phone1.replace(/\s/g, '')}`}
                  className="btn-secondary w-full justify-center py-4 text-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Llamar — <span className="lining-nums">{CONTACT_INFO.phone1}</span>
                </a>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="btn-primary w-full justify-center py-4 text-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar email
                </a>
              </div>

              {/* Divider */}
              <div className="border-t border-stone-100" />

              {/* Contact details */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl font-semibold text-stone-900">
                  Información de contacto
                </h2>

                <div className="space-y-5">
                  {/* Phones */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-wood-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-wood-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-600 mb-1">
                        Teléfonos
                      </p>
                      <a href={`tel:${CONTACT_INFO.phone1.replace(/\s/g, '')}`} className="font-sans lining-nums text-stone-700 hover:text-wood-700 transition-colors block">
                        {CONTACT_INFO.phone1}
                      </a>
                      <a href={`tel:${CONTACT_INFO.phone2.replace(/\s/g, '')}`} className="font-sans lining-nums text-stone-700 hover:text-wood-700 transition-colors block">
                        {CONTACT_INFO.phone2}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-600 mb-1">
                        WhatsApp
                      </p>
                      <a
                        href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans lining-nums text-stone-700 hover:text-green-600 transition-colors"
                      >
                        {CONTACT_INFO.whatsappDisplay}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-wood-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-wood-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-600 mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        className="font-sans text-stone-700 hover:text-wood-700 transition-colors"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-wood-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-wood-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-600 mb-1">
                        Showroom
                      </p>
                      <p className="font-sans text-stone-700 leading-snug">{CONTACT_INFO.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Hours + map */}
            <div className="space-y-8">
              {/* Business hours */}
              <div className="bg-stone-50 border border-stone-100 p-8">
                <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-6">
                  Horario de atención
                </h2>
                <div className="space-y-3">
                  {BUSINESS_HOURS.map(h => (
                    <div key={h.day} className="flex justify-between items-center py-2.5 border-b border-stone-100 last:border-0">
                      <span className="font-sans text-stone-700 font-medium text-sm">{h.day}</span>
                      <span className="font-sans text-stone-600 text-sm tracking-wide">{h.hours}</span>
                    </div>
                  ))}
                  <p className="font-sans text-xs text-stone-500 pt-2">
                    * Domingos y feriados: cerrado
                  </p>
                </div>
              </div>

              {/* Note */}
              <div className="bg-wood-50 border-l-2 border-wood-500 pl-5 py-4">
                <p className="font-serif text-lg text-stone-800 italic">
                  "Por cualquier consulta puede comunicarse por los diferentes medios,
                  e-mail, teléfono o WhatsApp."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
