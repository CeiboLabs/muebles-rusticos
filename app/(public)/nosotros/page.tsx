import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SITE_NAME, SITE_URL, CONTACT_INFO } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: `Hace +30 años comenzamos restaurando muebles antiguos. Hoy ${SITE_NAME} fabrica más de 350 modelos en 12 ambientes diferentes.`,
  alternates: { canonical: `${SITE_URL}/nosotros` },
}

const WOODS = [
  { name: 'Álamo',        type: 'Nacional',  image: '/images/maderas/alamo.jpeg' },
  { name: 'Eucaliptus',   type: 'Nacional',  image: '/images/maderas/eucaliptus.jpg' },
  { name: 'Acacia Negra', type: 'Nacional',  image: '/images/maderas/acacianegra.jpeg' },
  { name: 'Ciprés',       type: 'Nacional',  image: '/images/maderas/cipres.jpeg' },
  { name: 'Cedro',        type: 'Importada', image: '/images/maderas/cedro.jpeg' },
  { name: 'Roble',        type: 'Importada', image: '/images/maderas/roble.avif' },
  { name: 'Fresno',       type: 'Importada', image: '/images/maderas/fresno.jpeg' },
  { name: 'Lapacho',      type: 'Importada', image: '/images/maderas/lapacho.jpeg' },
  { name: 'Olmo',         type: 'Importada', image: '/images/maderas/olmo.jpeg' },
  { name: 'Pino',         type: 'Nacional',  image: '/images/maderas/pino.webp' },
  { name: 'Cerejeira',    type: 'Importada', image: '/images/maderas/cerejeira.jpeg' },
  { name: 'Melamínicos',  type: 'Especial',  image: '/images/maderas/melaminicos.jpg' },
]

const PROCESS = [
  { step: '01', title: 'Consulta inicial',  text: 'Nos cuenta qué necesita. Por WhatsApp, teléfono o visitando nuestro showroom en Solymar.' },
  { step: '02', title: 'Diseño y propuesta',text: 'Definimos medidas, materiales, acabados y presupuesto. Trabajamos hasta que el diseño sea el ideal.' },
  { step: '03', title: 'Fabricación',       text: 'Nuestros carpinteros trabajan la madera pieza a pieza en el taller. Sin apuros, con oficio.' },
  { step: '04', title: 'Entrega e instalación', text: 'Coordinamos la entrega y si es necesario, la instalación en su hogar o local.' },
]

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-stone-50 border-b border-stone-100">
        <div className="container-max section-padding">
          <div className="max-w-2xl">
            <span className="eyebrow mb-6 inline-flex">Quiénes somos</span>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-stone-900 mb-6 leading-tight">
              +30 años creando<br />
              <span className="text-wood-700 italic">muebles únicos</span>
            </h1>
            <p className="font-sans text-xl text-stone-600 leading-relaxed font-light">
              Más de +30 años de artesanía uruguaya fabricando muebles a medida
              con madera maciza de primera calidad.
            </p>
          </div>
        </div>
      </section>


      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container-max section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="/images/banner-living-1.jpg"
                  alt="Taller Muebles Rústicos Solymar"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            <div>
              <span className="eyebrow mb-5 inline-flex">Nuestra historia</span>
              <h2 className="font-serif text-4xl font-bold text-stone-900 mb-4 leading-tight">
                Acerca de Muebles Rústicos
              </h2>
              <p className="font-serif text-lg italic text-wood-700 mb-6 leading-relaxed">
                En Muebles Rústicos Solymar creamos los muebles de tus sueños
                y los que no los inventamos...
              </p>
              <div className="space-y-4 font-sans text-stone-600 leading-relaxed">
                <p>
                  Hace +30 años de nuestros comienzos, en la restauración de muebles antiguos
                  y luego en la fabricación de muebles para interiores. Fuimos creciendo e
                  incorporando nuevos productos relacionados con la madera, llegando a fabricar
                  diseños exclusivos para decoración, todo lo necesario para la cocina, baños o
                  vestidores, así como deck, barbacoas y pérgolas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-20 bg-stone-50">
        <div className="container-max section-padding">
          <div className="text-center mb-14">
            <span className="eyebrow justify-center mb-4 inline-flex">Fabricación</span>
            <h2 className="font-serif text-4xl font-bold text-stone-900">Maderas y materiales</h2>
            <p className="mt-4 font-sans text-stone-600 max-w-lg mx-auto font-light">
              Trabajamos con maderas importadas y nacionales de primera calidad,
              combinándolas con fibras y melamínicos para diseños modernos y decorativos.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
            {WOODS.map(wood => (
              <div key={wood.name} className="bg-white border border-stone-100 overflow-hidden hover:border-wood-200 hover:shadow-sm transition-all">
                <div className="relative h-16 w-full">
                  <Image
                    src={wood.image}
                    alt={`Textura de madera ${wood.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 17vw"
                  />
                </div>
                <div className="p-3 text-center">
                  <p className="font-sans text-sm font-semibold text-stone-800 leading-tight">{wood.name}</p>
                  <p className="font-sans text-xs text-stone-600 mt-1 uppercase tracking-wider">{wood.type}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="font-sans text-sm text-stone-600 text-center max-w-2xl mx-auto">
            Todos los componentes del mueble son de alta calidad. Con la mano de obra
            especializada de nuestro taller, logramos un producto de primer nivel.
          </p>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="container-max section-padding">
          <div className="text-center mb-14">
            <span className="eyebrow justify-center mb-4 inline-flex">Cómo trabajamos</span>
            <h2 className="font-serif text-4xl font-bold text-stone-900">
              Un proceso transparente<br />de principio a fin
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS.map(p => (
              <div key={p.step}>
                <div className="font-serif text-6xl font-bold text-wood-300 leading-none mb-4">{p.step}</div>
                <h3 className="font-serif text-xl font-semibold text-stone-900 mb-3 -mt-4">{p.title}</h3>
                <p className="font-sans text-sm text-stone-600 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-wood-800">
        <div className="container-max section-padding text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">
            ¿Listo para comenzar?
          </h2>
          <p className="font-sans text-wood-200 mb-8 font-light">
            Contáctenos hoy y reciba una propuesta sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hola%2C%20quisiera%20una%20propuesta%20a%20medida`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-8 py-3.5 text-sm"
            >
              Consultar por WhatsApp
            </a>
            <Link href="/contacto" className="btn-secondary border-white/30 text-white hover:bg-white/10 px-8 py-3.5 text-sm">
              Ver contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
