import Image from 'next/image'

const MADERAS = [
  { nombre: 'Acacia Negra',  archivo: 'acacianegra.jpeg' },
  { nombre: 'Álamo',         archivo: 'alamo.jpeg' },
  { nombre: 'Cedro',         archivo: 'cedro.jpeg' },
  { nombre: 'Cerejeira',     archivo: 'cerejeira.jpeg' },
  { nombre: 'Ciprés',        archivo: 'cipres.jpeg' },
  { nombre: 'Eucaliptus',    archivo: 'eucaliptus.jpg' },
  { nombre: 'Fresno',        archivo: 'fresno.jpeg' },
  { nombre: 'Lapacho',       archivo: 'lapacho.jpeg' },
  { nombre: 'Olmo',          archivo: 'olmo.jpeg' },
  { nombre: 'Pino',          archivo: 'pino.webp' },
  { nombre: 'Roble',         archivo: 'roble.avif' },
  { nombre: 'Melamínicos',   archivo: 'melaminicos.jpg' },
]

export default function MaderasSection() {
  return (
    <section className="py-20 bg-wood-50">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="eyebrow mb-4 inline-flex">Nuestros materiales</span>
          <h2 className="font-serif text-4xl lg:text-5xl font-bold text-stone-900 leading-tight">
            Las maderas que <span className="text-wood-700 italic">trabajamos</span>
          </h2>
          <p className="mt-4 font-sans text-stone-600 max-w-xl mx-auto text-sm leading-relaxed">
            Seleccionamos cada especie por su calidad, durabilidad y belleza natural.
            Trabajamos con madera maciza proveniente de bosques responsables.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {MADERAS.map((madera) => (
            <div
              key={madera.archivo}
              className="group relative overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={`/images/maderas/${madera.archivo}`}
                  alt={`Madera de ${madera.nombre}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-wood-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="py-2.5 px-3 bg-white border-t border-wood-100">
                <p className="font-serif text-sm font-semibold text-stone-800 text-center">{madera.nombre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
