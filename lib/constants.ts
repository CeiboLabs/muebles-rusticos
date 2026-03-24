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

export const CATEGORIES = [
  { name: 'Comedores',             slug: 'comedores',          description: 'Mesas y sillas de comedor artesanales' },
  { name: 'Living',                slug: 'living',             description: 'Sofás, sillones y muebles para el living' },
  { name: 'Dormitorios',           slug: 'dormitorios',        description: 'Camas, placares y mesas de luz' },
  { name: 'Dormitorios de Niños',  slug: 'dormitorios-ninos',  description: 'Muebles infantiles seguros y duraderos' },
  { name: 'Baños y Cocinas',       slug: 'banos-y-cocinas',    description: 'Muebles para baño y cocina' },
  { name: 'Barbacoas',             slug: 'barbacoas',          description: 'Parrillas y estructuras para asado' },
  { name: 'Escritorios y Oficinas',slug: 'escritorios',        description: 'Escritorios y muebles de oficina' },
  { name: 'Muebles de Exterior',   slug: 'exterior',           description: 'Muebles resistentes para exteriores' },
  { name: 'Hierro y Madera',       slug: 'hierro-y-madera',    description: 'Combinaciones de hierro forjado y madera' },
  { name: 'Tapicería',             slug: 'tapiceria',          description: 'Tapizado artesanal de alta calidad' },
  { name: 'Pérgolas y Decks',      slug: 'pergolas-y-decks',   description: 'Estructuras de madera para exteriores' },
  { name: 'Decoración',            slug: 'decoracion',         description: 'Piezas decorativas únicas' },
]
