import { MetadataRoute } from 'next'

const BASE_URL = 'https://experthome168.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/internal/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
