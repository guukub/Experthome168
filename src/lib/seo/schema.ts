export function generateRealEstateListingSchema(property: any) {
  const price = property.price > 0 ? property.price : property.rent_price;
  const isRent = !property.price && property.rent_price > 0;
  
  return {
    "@context": "https://schema.org",
    "@type": ["Offer", "RealEstateListing", "Place"],
    "name": property.title,
    "description": property.description || `${property.property_type} ${property.location}`,
    "url": `https://experthome168.com/properties/${property.slug}`,
    "image": property.images?.length ? property.images : undefined,
    "price": price,
    "priceCurrency": "THB",
    "businessFunction": isRent ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressRegion": property.province,
      "addressCountry": "TH"
    }
  }
}

export function generateBreadcrumbSchema(items: { name: string; item: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}
