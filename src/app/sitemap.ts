import { MetadataRoute } from 'next'
import { getPropertiesAction } from './actions'

const BASE_URL = 'https://experthome168.com'

// Static pages with approximate last-changed dates
// Update these when you make significant changes to each page
const STATIC_PAGES: { route: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
  { route: '', priority: 1.0, changeFrequency: 'daily' },
  { route: '/properties', priority: 0.9, changeFrequency: 'daily' },
  { route: '/portfolio', priority: 0.7, changeFrequency: 'weekly' },
  { route: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { route: '/services/sell-property', priority: 0.8, changeFrequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allProps = await getPropertiesAction()

  // Static routes — no fabricated lastModified
  const routes = STATIC_PAGES.map(({ route, priority, changeFrequency }) => ({
    url: `${BASE_URL}${route}`,
    changeFrequency,
    priority,
    // Omit lastModified for static pages since we can't reliably track it
  }))

  // Dynamic property routes — use real updated_at timestamp when available
  const propertyRoutes = allProps
    .filter(p => p.is_visible)
    .map((property) => ({
      url: `${BASE_URL}/properties/${property.slug}`,
      lastModified: property.updated_at
        ? new Date(property.updated_at).toISOString()
        : property.created_at
          ? new Date(property.created_at).toISOString()
          : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

  return [...routes, ...propertyRoutes]
}
