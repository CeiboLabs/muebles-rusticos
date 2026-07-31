export const STORAGE_LIMIT_BYTES = 150 * 1024 * 1024 // 150 MB

export const SITE_NAME = 'Muebles Rústicos Solymar'
export const SITE_TAGLINE = 'Creamos los muebles de tus sueños'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mueblesrusticos.com.uy'
export const SITE_DESCRIPTION =
  'En Muebles Rústicos Solymar creamos los muebles de tus sueños y los que no los inventamos. +30 años de experiencia artesanal en Uruguay.'

export const CONTACT_INFO = {
  phone1: '2696 0582',
  phone2: '2696 3892',
  whatsapp: '59897492412',
  whatsappDisplay: '097 492 412',
  email: 'info@mueblesrusticos.com.uy',
  address: 'Av. Giannattasio Km 23, Manzana 235, Solar 15 esq. Uruguay, Solymar',
  addressShort: 'Av. Giannattasio Km 23, Solymar',
  // Google Maps embed for Solymar / Lagomar area (Av. Giannattasio Km 23)
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3271.5!2d-56.0330!3d-34.8290!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x959f81e9a6f59c4b%3A0x4b5e1b3e2a9f1c2d!2sAv.%20Giannatassio%2C%20Solymar%2C%20Canelones%2C%20Uruguay!5e0!3m2!1ses!2suy!4v1700000000000',
}

export const BUSINESS_HOURS = [
  { day: 'Lunes',     hours: '8:30 – 17:30' },
  { day: 'Martes',    hours: '8:30 – 17:30' },
  { day: 'Miércoles', hours: '8:30 – 17:30' },
  { day: 'Jueves',    hours: '8:30 – 17:30' },
  { day: 'Viernes',   hours: '8:30 – 17:30' },
  { day: 'Sábado',    hours: '9:00 – 13:00' },
]

export const STATS = [
  { number: '30',     label: 'Años de experiencia' },
  { number: '10.000', label: 'Muebles entregados' },
  { number: '350',    label: 'Modelos de muebles' },
  { number: '12',     label: 'Ambientes diferentes' },
]

interface Category {
  name: string
  slug: string
  description: string
  /** Longer, category-specific body copy (maderas + cuidados). Falls back to `description` when absent. */
  longDescription?: string
}

export const CATEGORIES: Category[] = [
  {
    name: 'Comedores',
    slug: 'comedores',
    description: 'Mesas y sillas de comedor fabricadas a medida en madera maciza en Uruguay. Diseño artesanal único para tu hogar por Muebles Rústicos Solymar.',
    longDescription: 'El roble y el fresno son las maderas más elegidas para nuestra línea de comedores: ambas son densas y resistentes al uso diario, lo que las vuelve ideales para superficies que reciben peso, roce y contacto frecuente. El roble aporta una veta marcada y un tono cálido que envejece bien con el tiempo, mientras que el fresno es apreciado por su elasticidad y resistencia a los golpes, algo clave en mesas y sillas de uso constante. Para mantener estas piezas, se recomienda limpiar con un paño seco o apenas húmedo, y evitar el contacto directo y prolongado con líquidos.',
  },
  { name: 'Living',                slug: 'living',             description: 'Sofás, sillones y muebles de living a medida en madera maciza. Diseño artesanal uruguayo para espacios únicos por Muebles Rústicos Solymar.' },
  {
    name: 'Dormitorios',
    slug: 'dormitorios',
    description: 'Camas, placares y mesas de luz fabricados a medida en madera maciza en Uruguay. Dormitorios artesanales únicos por Muebles Rústicos Solymar.',
    longDescription: 'Para dormitorios priorizamos maderas livianas y fáciles de mantener, ya que son piezas que suelen moverse o reacomodarse con el tiempo. El cedro es una de las favoritas: además de su aroma característico, tiene una resistencia natural a insectos que lo hace ideal para roperos y cómodas. El álamo, liviano y de fácil trabajo, se combina frecuentemente con roble o fresno para sumar solidez donde se necesita. Recomendamos evitar la exposición directa al sol prolongada, que puede decolorar la madera con los años.',
  },
  { name: 'Dormitorios de Niños',  slug: 'dormitorios-ninos',  description: 'Muebles infantiles seguros y duraderos fabricados a medida en madera maciza en Uruguay. Diseños únicos para niños por Muebles Rústicos Solymar.' },
  { name: 'Baños y Cocinas',       slug: 'banos-y-cocinas',    description: 'Muebles de baño y cocina a medida en madera maciza, fabricados artesanalmente en Uruguay. Calidad y diseño por Muebles Rústicos Solymar.' },
  {
    name: 'Barbacoas',
    slug: 'barbacoas',
    description: 'Parrillas y estructuras para asado fabricadas a medida en madera maciza en Uruguay. Diseño artesanal único por Muebles Rústicos Solymar.',
    longDescription: 'El mobiliario para barbacoas combina resistencia estructural con maderas capaces de tolerar humedad, calor y uso frecuente al aire libre. El lapacho y el eucaliptus aportan la durabilidad necesaria para las piezas más expuestas, mientras que el álamo y el cedro se usan en detalles y estructuras internas donde el peso liviano facilita el armado. Como en toda pieza de exterior, recomendamos un mantenimiento periódico con aceite o barniz protector para conservar el color y la resistencia de la madera con el paso del tiempo.',
  },
  { name: 'Escritorios y Oficinas',slug: 'escritorios',        description: 'Escritorios y muebles de oficina a medida en madera maciza, fabricados artesanalmente en Uruguay. Diseño y funcionalidad por Muebles Rústicos Solymar.' },
  {
    name: 'Muebles de Exterior',
    slug: 'exterior',
    description: 'Muebles de exterior resistentes fabricados a medida en madera maciza en Uruguay. Diseño artesanal duradero por Muebles Rústicos Solymar.',
    longDescription: 'Los muebles de exterior exigen maderas con alta resistencia a la humedad y a la intemperie, y por eso trabajamos principalmente con eucaliptus y lapacho. El lapacho es una de las maderas más densas y duraderas que existen, con resistencia natural a la humedad y a insectos, ideal para piezas que quedan a la intemperie todo el año. El eucaliptus acompaña esta línea por su buena relación entre durabilidad y trabajabilidad. Para conservar estas piezas en el tiempo, se recomienda aplicar un impregnante o aceite protector para exterior de forma periódica.',
  },
  { name: 'Hierro y Madera',       slug: 'hierro-y-madera',    description: 'Combinaciones únicas de hierro forjado y madera maciza fabricadas a medida en Uruguay. Estilo rústico e industrial por Muebles Rústicos Solymar.' },
  { name: 'Tapicería',             slug: 'tapiceria',          description: 'Tapizado artesanal de alta calidad a medida en Uruguay. Sofás, sillones y sillas tapizados con +30 años de experiencia por Muebles Rústicos Solymar.' },
  { name: 'Pérgolas y Decks',      slug: 'pergolas-y-decks',   description: 'Pérgolas y decks de madera maciza fabricados a medida en Uruguay. Estructuras artesanales para exteriores únicos por Muebles Rústicos Solymar.' },
  { name: 'Decoración',            slug: 'decoracion',         description: 'Piezas decorativas únicas fabricadas a medida en madera maciza en Uruguay. Arte artesanal para espacios únicos por Muebles Rústicos Solymar.' },
]
