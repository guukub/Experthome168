import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Maximize, Tag, Home } from 'lucide-react'
import { Property } from '@/types/property'
import { formatPrice } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  className?: string
}

export default function PropertyCard({ property, className = '' }: PropertyCardProps) {
  const mainImage = property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80'

  const isSale = (property.price || 0) > 0
  const isRent = (property.rent_price || 0) > 0

  // Colors for property types or statuses
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'บ้านเดี่ยว': return 'bg-red-500'
      case 'ทาวน์เฮ้าส์': return 'bg-orange-500'
      case 'คอนโด': return 'bg-purple-500'
      case 'ที่ดิน': return 'bg-green-500'
      default: return 'bg-blue-500'
    }
  }

  // Get a fake discount or highlight text for the bottom banner
  const getHighlightBanner = () => {
    if (property.highlights && property.highlights.length > 0) {
      return property.highlights[0]
    }
    return property.is_featured ? 'ทรัพย์แนะนำพิเศษ!' : ''
  }

  const highlightBanner = getHighlightBanner()

  const getBannerColor = (type: string) => {
    switch (type) {
      case 'บ้านเดี่ยว': return 'bg-red-50 text-red-600'
      case 'ทาวน์เฮ้าส์': return 'bg-orange-50 text-orange-600'
      case 'คอนโด': return 'bg-purple-50 text-purple-600'
      case 'ที่ดิน': return 'bg-green-50 text-green-600'
      default: return 'bg-blue-50 text-blue-600'
    }
  }

  return (
    <Link href={`/properties/${property.slug}`} className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col overflow-hidden ${className}`}>
      {/* Image Section */}
      <div className="relative aspect-video w-full overflow-hidden shrink-0">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Top Left Badge (Discount % or Property Type) */}
        <div className="absolute top-0 left-0 z-10">
          {isSale && property.original_price && property.original_price > property.price ? (
            <span className="bg-red-500 text-white px-3 py-1.5 rounded-br-lg font-bold text-sm tracking-wide shadow-md block">
              {Math.round(((property.original_price - property.price) / property.original_price) * 100)}% OFF
            </span>
          ) : (
            <span className={`${getTypeColor(property.property_type)} text-white px-3 py-1.5 rounded-br-lg font-bold text-sm tracking-wide shadow-md block`}>
              {property.property_type}
            </span>
          )}
        </div>

        {/* Top Right Badge (Status) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {isSale && (
            <span className="bg-[#0a192f] text-white px-3 py-1.5 rounded-md font-medium text-xs tracking-wide shadow-md">
              For Sale
            </span>
          )}
          {!isSale && isRent && (
            <span className="bg-forest-600 text-white px-3 py-1.5 rounded-md font-medium text-xs tracking-wide shadow-md">
              For Rent
            </span>
          )}
        </div>

        {/* Bottom Gradient for Price */}
        <div className={`absolute inset-x-0 bottom-0 h-32 pointer-events-none ${!isSale && isRent ? 'bg-gradient-to-t from-forest-800/90 via-forest-800/40 to-transparent' : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'}`} />
        
        {/* Price Details on Image */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
          {isSale ? (
            <div>
              {property.original_price && property.original_price > property.price && (
                <div className="text-white/80 line-through text-xs mb-0.5">
                  {formatPrice(property.original_price)}
                </div>
              )}
              <div className="text-2xl font-bold text-white leading-none">
                {formatPrice(property.price)}
              </div>
            </div>
          ) : isRent ? (
            <div>
              <div className="text-2xl font-bold text-white leading-none">
                {formatPrice(property.rent_price || 0)} <span className="text-sm font-normal opacity-90">/ เดือน</span>
              </div>
            </div>
          ) : null}
          
          {isSale && property.original_price && property.original_price > property.price && (
            <div className={`text-white text-[10px] px-2 py-1 rounded font-bold bg-red-500`}>
              Save {formatPrice(property.original_price - property.price)}
            </div>
          )}
        </div>
      </div>
      
      {/* Both Rent and Sale Bar */}
      {isSale && isRent && (
        <div className="bg-forest-700 text-white px-4 py-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-medium text-forest-100">
            <Home size={14} />
            For Rent
          </div>
          <div className="font-bold">
            {formatPrice(property.rent_price || 0)} <span className="text-xs font-normal text-forest-100">/ เดือน</span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-1 mb-1 group-hover:text-forest-700 transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={14} className="shrink-0" />
          <span className="truncate">{property.location}{property.project_name ? ` · ${property.project_name}` : ''}</span>
        </div>

        {/* Rent Only Highlight Box */}
        {!isSale && isRent && (
          <div className="bg-forest-50 border border-forest-100 rounded-lg p-2.5 flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-forest-700 font-medium text-sm">
              <Home size={16} />
              ค่าเช่า
            </div>
            <div className="font-bold text-forest-700">
              {formatPrice(property.rent_price || 0)} <span className="text-xs font-normal">/ เดือน</span>
            </div>
          </div>
        )}
        
        <div className="mt-auto">
          {/* Features Row */}
          {property.property_type !== 'ที่ดิน' ? (
            <div className="flex items-center justify-between text-sm text-gray-600 px-1 pt-1 border-t border-gray-50">
              <div className="flex items-center gap-1.5">
                <Bed size={16} />
                <span className="font-medium">{property.bedrooms || 0} Beds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bath size={16} />
                <span className="font-medium">{property.bathrooms || 0} Baths</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Maximize size={16} />
                <span className="font-medium">{property.usable_area || '-'}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center text-sm text-gray-600 px-1 pt-1 border-t border-gray-50 gap-4">
              <div className="flex items-center gap-1.5">
                <Maximize size={16} />
                <span className="font-medium">ที่ดิน {property.land_size || '-'}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Banner */}
      {highlightBanner && (
        <div className={`${getBannerColor(property.property_type)} py-2 px-4 text-center text-[11px] font-semibold flex items-center justify-center gap-1.5 shrink-0`}>
          <Tag size={12} />
          {highlightBanner}
        </div>
      )}
    </Link>
  )
}

