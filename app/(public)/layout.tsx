import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ScrollToTop from '@/components/layout/ScrollToTop'
import { SITE_NAME, SITE_URL, CONTACT_INFO } from '@/lib/constants'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-transparent.png`,
  image: `${SITE_URL}/images/banner-living-1.jpg`,
  description: 'Fábrica de muebles rústicos a medida en madera maciza. +30 años de experiencia artesanal en Uruguay.',
  telephone: CONTACT_INFO.phone1,
  email: CONTACT_INFO.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Giannattasio Km 23, Manzana 235, Solar 15',
    addressLocality: 'Solymar',
    addressRegion: 'Canelones',
    addressCountry: 'UY',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -34.829,
    longitude: -56.033,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:30', closes: '17:30' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '13:00' },
  ],
  sameAs: [`https://wa.me/${CONTACT_INFO.whatsapp}`],
  priceRange: '$$',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollToTop />
      <Header />
      <main className="pt-20 md:pt-24">{children}</main>
      <Footer />
    </>
  )
}
