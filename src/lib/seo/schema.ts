const BASE_URL = 'https://experthome168.com'

/**
 * Generates a valid schema.org structured data object for a real estate property listing.
 * Uses RealEstateListing + Offer pattern.
 * All fields are populated only when real data exists.
 */
export function generateRealEstateListingSchema(property: any) {
  const isSale = (property.price || 0) > 0
  const isRent = !isSale && (property.rent_price || 0) > 0
  const price = isSale ? property.price : property.rent_price

  // Map property_type to valid schema.org housing type
  const typeMap: Record<string, string> = {
    'บ้านเดี่ยว': 'SingleFamilyResidence',
    'ทาวน์เฮ้าส์': 'Townhouse',
    'ทาวน์โฮม': 'Townhouse',
    'คอนโด': 'Apartment',
    'อพาร์ทเมนต์': 'Apartment',
    'ที่ดิน': 'LandLot',
    'อาคารพาณิชย์': 'StoreOrOffice',
  }
  const schemaType = typeMap[property.property_type] || 'Residence'

  // Build address object only from real data
  const addressParts: Record<string, string> = {
    '@type': 'PostalAddress',
    addressCountry: 'TH',
  }
  if (property.location) addressParts.addressLocality = property.location
  if (property.district) addressParts.addressRegion = property.district
  if (property.province) addressParts.addressRegion = property.province
  if (property.postcode) addressParts.postalCode = property.postcode

  // Build Offer only when price exists
  const offer = price ? {
    '@type': 'Offer',
    price: price,
    priceCurrency: 'THB',
    businessFunction: isRent
      ? 'http://purl.org/goodrelations/v1#LeaseOut'
      : 'http://purl.org/goodrelations/v1#Sell',
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'RealEstateAgent',
      name: 'Experthome168',
      url: BASE_URL,
    },
  } : undefined

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: property.title,
    url: `${BASE_URL}/properties/${property.slug}`,
    address: addressParts,
  }

  if (property.description) schema.description = property.description
  if (property.images?.length) schema.image = property.images
  if (property.bedrooms > 0) schema.numberOfRooms = property.bedrooms
  if (property.bathrooms > 0) schema.numberOfBathroomsTotal = property.bathrooms
  if (offer) schema.offers = offer

  return schema
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generates Organization / RealEstateAgent schema from real settings data.
 * Only includes fields that have actual values — no fabricated data.
 */
export function generateOrganizationSchema(settings: {
  phone?: string
  lineUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
  email?: string
  address?: string
  workingHours?: string
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Experthome168',
    alternateName: 'ตี๋บางบอน',
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    sameAs: [] as string[],
  }

  // Only add contact info when the real value exists
  if (settings.phone) {
    schema.telephone = settings.phone
  }
  if (settings.email) {
    schema.email = settings.email
  }
  if (settings.address) {
    schema.address = {
      '@type': 'PostalAddress',
      addressLocality: settings.address,
      addressCountry: 'TH',
    }
  }
  // Social profiles as sameAs — only real URLs
  const sameAs: string[] = []
  if (settings.facebookUrl && settings.facebookUrl !== '#') sameAs.push(settings.facebookUrl)
  if (settings.tiktokUrl && settings.tiktokUrl !== '#') sameAs.push(settings.tiktokUrl)
  if (sameAs.length > 0) schema.sameAs = sameAs
  else delete schema.sameAs

  return schema
}

/**
 * Generates WebSite schema to establish brand entity.
 * No SearchAction — site search is not a standalone URL endpoint.
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Experthome168',
    url: BASE_URL,
    inLanguage: 'th',
    publisher: {
      '@type': 'RealEstateAgent',
      name: 'Experthome168',
      url: BASE_URL,
    },
  }
}
