import type { MetadataRoute } from 'next'
import { CATEGORIES, SITE_URL } from '@/lib/constants'

export const revalidate = 3600

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/catalogo`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/nosotros`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${SITE_URL}/catalogo/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages]
}
