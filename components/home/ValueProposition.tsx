import Image from 'next/image'

const VALUES = [
  {
    title: 'Madera maciza de primera',
    text: 'Trabajamos con cedro, roble, lapacho, eucaliptus y álamo. Cada madera se selecciona por su calidad, resistencia y belleza natural.',
  },
  {
    title: 'Diseño 100% a medida',
    text: 'Cada mueble nace de una conversación. Lo diseñamos según su espacio, gustos y presupuesto. Nada es estándar.',
  },
  {
    title: '+30 años de oficio',
    text: 'Comenzamos restaurando muebles antiguos. Hoy fabricamos desde comedores hasta pergolas, con el mismo amor por el detalle.',
  },
  {
    title: '12 ambientes distintos',
    text: 'Comedores, dormitorios, baños, cocinas, exteriors, barbacoas y más. Si es de madera, lo hacemos.',
  },
]

export default function ValueProposition() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="/images/banner-living-2.jpg"
                alt="Mesa de living de madera rústica"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 bg-wood-700 text-white p-6 hidden md:block">
              <div className="font-serif text-4xl font-bold">+30</div>
              <div className="font-sans text-xs uppercase tracking-widest mt-1 text-wood-200">años de oficio</div>
            </div>
          </div>

          {/* Text */}
          <div>
            <span className="eyebrow mb-5 inline-flex">Por qué elegirnos</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold text-stone-900 mb-8 leading-tight">
              Artesanía con<br />
              <span className="text-wood-700 italic">propósito</span>
            </h2>

            <div className="space-y-6">
              {VALUES.map((v, i) => (
                <div key={v.title} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 bg-wood-100 flex items-center justify-center mt-0.5">
                    <span className="font-serif text-sm font-bold text-wood-700">0{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-stone-900 mb-1">{v.title}</h3>
                    <p className="font-sans text-sm text-stone-600 leading-relaxed">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
