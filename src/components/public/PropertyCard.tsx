import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Car, Maximize } from 'lucide-react'
import { Property } from '@/types/property'
import { formatPrice, getStatusColor, getStatusDotColor, getPropertyTypeIcon } from '@/lib/utils'

interface PropertyCardProps {
  property: Property
  className?: string
}

export default function PropertyCard({ property, className = '' }: PropertyCardProps) {
  const mainImage = property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80'

  return (
    <Link href={`/properties/${property.slug}`} className={`card card-hover group block ${className}`}>
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <Image
          src={mainImage}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge text-xs font-bold ${getStatusColor(property.status)}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(property.status)}`} />
            {property.status}
          </span>
        </div>

        {/* Featured badge */}
        {property.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-gold-500 text-white border-gold-500 text-xs font-bold">
              ⭐ แนะนำ
            </span>
          </div>
        )}

        {/* Property type */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm font-medium">
            {getPropertyTypeIcon(property.property_type)} {property.property_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <div className="text-2xl font-bold text-forest-700 mb-1.5">
          {formatPrice(property.price)}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 mb-2 group-hover:text-forest-700 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
          <MapPin size={13} className="shrink-0 text-forest-500" />
          <span className="truncate">{property.location}</span>
          {property.project_name && (
            <span className="text-gray-400">· {property.project_name}</span>
          )}
        </div>

        {/* Features */}
        {property.property_type !== 'ที่ดิน' && (
          <div className="flex items-center gap-3 text-sm text-gray-500 border-t border-gray-100 pt-3">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <div className="feature-item">
                <Bed size={14} className="text-forest-500" />
                <span>{property.bedrooms} ห้องนอน</span>
              </div>
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <div className="feature-item">
                <Bath size={14} className="text-forest-500" />
                <span>{property.bathrooms} ห้องน้ำ</span>
              </div>
            )}
            {property.parking !== undefined && property.parking > 0 && (
              <div className="feature-item">
                <Car size={14} className="text-forest-500" />
                <span>{property.parking} คัน</span>
              </div>
            )}
          </div>
        )}

        {/* Land/Area */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
          {property.land_size && property.land_size !== '-' && (
            <div className="feature-item">
              <Maximize size={13} className="text-forest-500" />
              <span>ที่ดิน {property.land_size}</span>
            </div>
          )}
          {property.usable_area && property.usable_area !== '-' && (
            <div className="feature-item">
              <span>พื้นที่ {property.usable_area}</span>
            </div>
          )}
        </div>

        {/* Highlights */}
        {property.highlights && property.highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {property.highlights.slice(0, 3).map((h, i) => (
              <span key={i} className="px-2 py-0.5 bg-forest-50 text-forest-700 text-xs rounded-lg font-medium border border-forest-100">
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
