import { Metadata } from 'next'

interface PropertyForSEO {
  title: string
  property_type: string
  location: string
  province?: string
  price?: number
  rent_price?: number
  description?: string
  images?: string[]
  slug: string
}

export const BASE_URL = 'https://experthome168.com'

export function generatePropertyMetadata(property: PropertyForSEO): Metadata {
  const propertyType = property.property_type || 'อสังหาริมทรัพย์'
  const locationStr = [property.location, property.province].filter(Boolean).join(' ')
  
  let priceStr = ''
  if (property.price && property.price > 0) {
    priceStr = `ราคา ${property.price.toLocaleString()} บาท`
  } else if (property.rent_price && property.rent_price > 0) {
    priceStr = `ให้เช่า ${property.rent_price.toLocaleString()} บาท/เดือน`
  }

  // Fallback description if none is provided
  const description = property.description || `${property.title} - ${propertyType} ทำเล ${locationStr} ${priceStr}. Expert Home 168 ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์`
  
  const ogImages = property.images && property.images.length > 0 
    ? property.images.map(url => ({ url }))
    : [{ url: `${BASE_URL}/og-image.jpg` }] // default fallback image

  const url = `${BASE_URL}/properties/${property.slug}`

  return {
    title: property.title,
    description: description.substring(0, 160), // Keep description within recommended limits
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: property.title,
      description: description.substring(0, 160),
      url: url,
      type: 'article',
      images: ogImages,
      siteName: 'Expert Home 168',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: description.substring(0, 160),
      images: ogImages.map(img => img.url),
    },
  }
}
