import { MetadataRoute } from 'next'
import { getPropertiesAction } from './actions'

const BASE_URL = 'https://experthome168.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allProps = await getPropertiesAction()
  
  // Base static routes
  const routes = [
    '',
    '/properties',
    '/portfolio',
    '/contact'
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic property routes
  const propertyRoutes = allProps
    .filter(p => p.is_visible)
    .map((property) => ({
      url: `${BASE_URL}/properties/${property.slug}`,
      lastModified: property.updated_at ? new Date(property.updated_at).toISOString() : new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }))

  return [...routes, ...propertyRoutes]
}
