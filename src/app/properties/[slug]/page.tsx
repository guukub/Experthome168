import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Bed, Bath, Car, Maximize, ArrowLeft, Phone, MessageCircle, Facebook, CheckCircle, Calendar, Play } from 'lucide-react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ImageGallery from '@/components/public/ImageGallery'
import { getPropertiesAction } from '@/app/actions'
import { formatPriceRaw, getStatusColor, getStatusDotColor, getPropertyTypeIcon, formatDate, formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug)
  const allProps = await getPropertiesAction()
  const property = allProps.find(p => p.slug === decodedSlug)
  if (!property) return { title: 'ไม่พบทรัพย์' }
  return {
    title: property.title,
    description: property.description || `${property.property_type} ${property.location} ราคา ${formatPriceRaw(property.price)}`,
  }
}

// Removed generateStaticParams because force-dynamic is used

export default async function PropertyDetailPage({ params }: Props) {
  const decodedSlug = decodeURIComponent(params.slug)
  const allProps = await getPropertiesAction()
  const visibleProperties = allProps.filter(p => p.is_visible)
  const property = visibleProperties.find(p => p.slug === decodedSlug)

  if (!property) notFound()

  const relatedProperties = visibleProperties
    .filter(p => p.id !== property.id && p.location === property.location)
    .slice(0, 3)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <div className="bg-white border-b border-gray-100">
          <div className="container-main py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-forest-600 transition-colors">หน้าแรก</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-forest-600 transition-colors">ทรัพย์ทั้งหมด</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium truncate">{property.title}</span>
            </div>
          </div>
        </div>

        <div className="container-main py-8">
          <Link href="/properties" className="btn-ghost text-gray-600 mb-6 inline-flex -ml-2">
            <ArrowLeft size={18} /> กลับไปดูทรัพย์ทั้งหมด
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ImageGallery images={property.images} title={property.title} />

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`badge ${getStatusColor(property.status)}`}>
                    <span className={`w-2 h-2 rounded-full ${getStatusDotColor(property.status)}`} />
                    {property.status}
                  </span>
                  <span className="badge bg-gray-100 text-gray-700 border-gray-200">
                    {getPropertyTypeIcon(property.property_type)} {property.property_type}
                  </span>
                  {property.is_featured && (
                    <span className="badge bg-gold-100 text-gold-700 border-gold-200">
                      ⭐ แนะนำ
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>

                <div className="flex items-center gap-2 text-gray-500 mb-4">
                  <MapPin size={16} className="text-forest-500" />
                  <span>{property.address || property.location}</span>
                </div>

                <div className="text-3xl md:text-4xl font-bold text-forest-700 mb-6">
                  {formatPriceRaw(property.price)}
                </div>

                {property.video_url && (
                  <a 
                    href={property.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors mb-6"
                  >
                    <Play size={18} fill="currentColor" />
                    ดูวิดีโอทรัพย์นี้
                  </a>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-5">รายละเอียดทรัพย์</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    property.bedrooms !== undefined && property.bedrooms > 0 && {
                      icon: Bed, label: 'ห้องนอน', value: `${property.bedrooms} ห้อง`, color: 'text-blue-500 bg-blue-50'
                    },
                    property.bathrooms !== undefined && property.bathrooms > 0 && {
                      icon: Bath, label: 'ห้องน้ำ', value: `${property.bathrooms} ห้อง`, color: 'text-cyan-500 bg-cyan-50'
                    },
                    property.parking !== undefined && property.parking > 0 && {
                      icon: Car, label: 'ที่จอดรถ', value: `${property.parking} คัน`, color: 'text-gray-500 bg-gray-50'
                    },
                    property.land_size && property.land_size !== '-' && {
                      icon: Maximize, label: 'ที่ดิน', value: property.land_size, color: 'text-forest-500 bg-forest-50'
                    },
                    property.usable_area && property.usable_area !== '-' && {
                      icon: Maximize, label: 'พื้นที่ใช้สอย', value: property.usable_area, color: 'text-emerald-500 bg-emerald-50'
                    },
                    property.property_type && {
                      icon: CheckCircle, label: 'ประเภท', value: property.property_type, color: 'text-purple-500 bg-purple-50'
                    },
                  ].filter(Boolean).map((spec: any, i) => {
                    const Icon = spec.icon
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${spec.color}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">{spec.label}</div>
                          <div className="font-semibold text-gray-900 text-sm">{spec.value}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {property.description && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-4">รายละเอียดเพิ่มเติม</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              )}

              {property.highlights && property.highlights.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-4">จุดเด่นของทรัพย์</h2>
                  <ul className="space-y-2.5">
                    {property.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle size={18} className="text-forest-500 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 text-lg mb-4">ทำเลที่ตั้ง</h2>
                <div className="w-full h-52 bg-gradient-to-br from-forest-50 to-emerald-100 rounded-xl flex flex-col items-center justify-center gap-2 border border-forest-100">
                  <MapPin size={32} className="text-forest-500" />
                  <p className="font-semibold text-forest-700">{property.location}</p>
                  <p className="text-sm text-gray-500">{property.address}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(property.address || property.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-sm text-forest-600 font-medium hover:underline"
                  >
                    เปิดใน Google Maps →
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-4">
                <div className="card p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-forest-500 to-forest-700 rounded-2xl flex items-center justify-center shadow-md">
                      <span className="text-white text-xl font-bold">ตี๋</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">ตี๋บางบอน</div>
                      <div className="text-sm text-gray-500">นายหน้าอสังหาริมทรัพย์</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-gold-400 text-xs">★</span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">5.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-4 p-3 bg-forest-50 rounded-xl">
                    <div className="text-2xl font-bold text-forest-700">{formatPriceRaw(property.price)}</div>
                    <div className="text-xs text-gray-500 mt-0.5">ราคาขาย</div>
                  </div>

                  <div className="space-y-3">
                    <a
                      href="tel:+66812345678"
                      className="btn-primary w-full justify-center text-base py-3.5"
                    >
                      <Phone size={18} /> โทร 081-234-5678
                    </a>
                    <a
                      href={`https://line.me/ti/p/~teebangbon`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle size={18} /> Line สอบถาม
                    </a>
                    <a
                      href="https://facebook.com/teebangbon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Facebook size={18} /> Facebook
                    </a>
                  </div>

                  <div className="mt-4 text-center text-xs text-gray-400">
                    เปิดบริการทุกวัน 8:00–20:00 น.
                  </div>
                </div>

                <div className="card p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">สรุปข้อมูล</h3>
                  <dl className="space-y-2 text-sm">
                    {[
                      { label: 'รหัสทรัพย์', value: `TBB-${property.id}` },
                      { label: 'ประเภท', value: property.property_type },
                      { label: 'ทำเล', value: property.location },
                      property.project_name && { label: 'โครงการ', value: property.project_name },
                      { label: 'สถานะ', value: property.status },
                      { label: 'อัพเดทล่าสุด', value: formatDate(property.updated_at) },
                    ].filter(Boolean).map((item: any, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-50 last:border-0">
                        <dt className="text-gray-500">{item.label}</dt>
                        <dd className="font-medium text-gray-900 text-right">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
                  <Calendar size={12} />
                  ลงประกาศเมื่อ {formatDate(property.created_at)}
                </div>
              </div>
            </div>
          </div>

          {relatedProperties.length > 0 && (
            <div className="mt-14">
              <h2 className="section-title text-2xl mb-6">ทรัพย์อื่นในย่านเดียวกัน</h2>
              <RelatedProperties properties={relatedProperties} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function RelatedProperties({ properties }: { properties: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => {
        const mainImage = property.images?.[0] || ''
        return (
          <Link key={property.id} href={`/properties/${property.slug}`} className="card card-hover group block">
            <div className="relative h-44 overflow-hidden">
              {mainImage && (
                <img src={mainImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="absolute top-2 left-2">
                <span className={`badge text-xs ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="text-xl font-bold text-forest-700 mb-1">{formatPrice(property.price)}</div>
              <div className="font-semibold text-gray-900 text-sm line-clamp-2">{property.title}</div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
