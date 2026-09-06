import { Metadata } from 'next'

interface PropertyForSEO {
  title: string
  property_type: string
  location: string
  province?: string
  district?: string
  price?: number
  rent_price?: number
  description?: string
  images?: string[]
  slug: string
  bedrooms?: number
  bathrooms?: number
  land_size?: string
  usable_area?: string
}

export const BASE_URL = 'https://experthome168.com'

export function generatePropertyMetadata(property: PropertyForSEO): Metadata {
  const propertyType = property.property_type || 'อสังหาริมทรัพย์'
  
  // Build location string from most specific to broadest
  const locationParts = [property.district, property.location, property.province].filter(Boolean)
  const locationStr = locationParts.slice(0, 2).join(' ')

  // Determine listing verb (ขาย vs เช่า)
  const isSale = (property.price || 0) > 0
  const isRent = (property.rent_price || 0) > 0
  const listingVerb = isSale ? 'ขาย' : isRent ? 'เช่า' : ''

  // Build price string
  let priceStr = ''
  if (isSale && property.price) {
    const millions = property.price / 1_000_000
    priceStr = millions >= 1 
      ? `ราคา ${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} ล้านบาท`
      : `ราคา ${property.price.toLocaleString('th-TH')} บาท`
  } else if (isRent && property.rent_price) {
    priceStr = `เช่า ${property.rent_price.toLocaleString('th-TH')} บาท/เดือน`
  }

  // Build title: [ListingVerb][Type] [Location] — [Title short] | Experthome168
  // Keep it readable, not keyword-stuffed. Max ~65 chars.
  const locationForTitle = locationStr || ''
  let seoTitle = property.title

  // If title doesn't already contain property_type, prepend listing info
  if (!property.title.toLowerCase().includes(listingVerb) && listingVerb) {
    const prefix = `${listingVerb}${propertyType}${locationForTitle ? ` ${locationForTitle}` : ''}`
    // Only prepend if it meaningfully adds context
    if (prefix.length < 30) {
      seoTitle = `${prefix} — ${property.title}`
    }
  }

  // Truncate title to avoid > 70 chars
  if (seoTitle.length > 65) {
    seoTitle = `${seoTitle.substring(0, 62)}...`
  }

  // Build description from real property data
  const descParts: string[] = []
  
  if (listingVerb) descParts.push(`${listingVerb}${propertyType}`)
  if (locationStr) descParts.push(`ทำเล ${locationStr}`)
  if (property.bedrooms && property.bedrooms > 0) descParts.push(`${property.bedrooms} ห้องนอน`)
  if (property.bathrooms && property.bathrooms > 0) descParts.push(`${property.bathrooms} ห้องน้ำ`)
  if (property.usable_area && property.usable_area !== '-') descParts.push(`พื้นที่ ${property.usable_area}`)
  if (priceStr) descParts.push(priceStr)
  descParts.push('สอบถามนัดชมได้ทุกวัน — Experthome168 ตี๋บางบอน')

  const autoDescription = descParts.join(' · ')

  // Use property description if provided and meaningful; fall back to auto-generated
  const descriptionRaw = (property.description && property.description.trim().length > 30)
    ? `${property.description.trim()} — ${priceStr || propertyType}`
    : autoDescription

  const description = descriptionRaw.substring(0, 160)

  const ogImages = property.images && property.images.length > 0
    ? property.images.slice(0, 1).map(url => ({ url, width: 1200, height: 630, alt: `${propertyType} ${locationStr}` }))
    : [] // No fallback og-image.jpg (file doesn't exist)

  const url = `${BASE_URL}/properties/${property.slug}`

  return {
    title: seoTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: seoTitle,
      description,
      url,
      type: 'article',
      ...(ogImages.length > 0 ? { images: ogImages } : {}),
      siteName: 'Experthome168',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description,
      ...(ogImages.length > 0 ? { images: ogImages.map(img => img.url) } : {}),
    },
  }
}
