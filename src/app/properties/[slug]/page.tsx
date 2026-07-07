import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Bed, Bath, Car, Maximize, ArrowLeft, Phone, MessageCircle, Facebook, CheckCircle, Calendar, Play } from 'lucide-react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import ImageGallery from '@/components/public/ImageGallery'
import { getPropertiesAction, getSettingsAction } from '@/app/actions'
import { formatPriceRaw, getStatusColor, getStatusDotColor, getPropertyTypeIcon, formatDate, formatPrice } from '@/lib/utils'

function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : null;
}

async function resolveMapCoordinates(url: string): Promise<string | null> {
  if (!url) return null;
  if (url.includes('maps.app.goo.gl') || url.includes('goo.gl/maps')) {
    try {
      const res = await fetch(url, { redirect: 'manual', next: { revalidate: 86400 } });
      const location = res.headers.get('location');
      if (location) {
        const searchMatch = location.match(/search\/([^\?\/]+)/);
        if (searchMatch) return searchMatch[1];
        
        const atMatch = location.match(/@([0-9.-]+,[0-9.-]+)/);
        if (atMatch) return atMatch[1];
      }
    } catch (e) {
      console.error("Failed to resolve map url", e);
    }
  } else if (url.includes('@')) {
    const atMatch = url.match(/@([0-9.-]+,[0-9.-]+)/);
    if (atMatch) return atMatch[1];
  }
  return null;
}

async function resolveTikTokVideoId(url: string): Promise<string | null> {
  if (!url) return null;
  const videoMatch = url.match(/video\/(\d+)/);
  if (videoMatch) return videoMatch[1];
  
  if (url.includes('vt.tiktok.com') || url.includes('vm.tiktok.com')) {
    try {
      const res = await fetch(url, { redirect: 'manual', next: { revalidate: 86400 } });
      const location = res.headers.get('location');
      if (location) {
        const match = location.match(/video\/(\d+)/);
        if (match) return match[1];
      }
    } catch (e) {
      console.error("Failed to resolve tiktok url", e);
    }
  }
  return null;
}

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

  const settings = await getSettingsAction()
  
  const mapQuery = property.map_url 
    ? await resolveMapCoordinates(property.map_url) 
    : null;
  const finalMapQuery = mapQuery || property.address || property.location;

  let videoEmbedType: 'youtube' | 'tiktok' | null = null;
  let videoEmbedUrl: string | null = null;

  if (property.video_url) {
    const ytUrl = getYouTubeEmbedUrl(property.video_url);
    if (ytUrl) {
      videoEmbedType = 'youtube';
      videoEmbedUrl = ytUrl;
    } else if (property.video_url.includes('tiktok.com')) {
      const ttId = await resolveTikTokVideoId(property.video_url);
      if (ttId) {
        videoEmbedType = 'tiktok';
        videoEmbedUrl = `https://www.tiktok.com/player/v1/${ttId}?music_info=0&description=0`;
      }
    }
  }

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

                <div className="flex flex-col gap-2 mb-8">
                  {/* Sale Price */}
                  {(property.price || 0) > 0 && (
                    <div className="flex flex-wrap items-baseline gap-3">
                      <div className="text-3xl md:text-4xl font-bold text-forest-700">
                        {formatPriceRaw(property.price)}
                      </div>
                      {property.original_price && property.original_price > property.price && (
                        <div className="text-lg text-gray-400 line-through font-medium">
                          {formatPriceRaw(property.original_price)}
                        </div>
                      )}
                      {property.original_price && property.original_price > property.price && (
                        <div className="bg-red-100 text-red-600 px-2.5 py-1 rounded-md text-sm font-bold">
                          ลด {formatPriceRaw(property.original_price - property.price)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rent Price */}
                  {(property.rent_price || 0) > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-forest-50 text-forest-600 px-3 py-1.5 rounded-lg text-sm font-bold border border-forest-100">
                        ให้เช่า
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">
                        {formatPriceRaw(property.rent_price || 0)} <span className="text-lg font-normal text-gray-500">/ เดือน</span>
                      </div>
                    </div>
                  )}
                </div>
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
                      icon: Maximize, label: 'ที่ดิน', value: property.land_size.includes('ตร') || property.land_size.includes('ไร่') || property.land_size.includes('งาน') ? property.land_size : `${property.land_size} ตร.ว.`, color: 'text-forest-500 bg-forest-50'
                    },
                    property.usable_area && property.usable_area !== '-' && {
                      icon: Maximize, label: 'พื้นที่ใช้สอย', value: property.usable_area.includes('ตร') ? property.usable_area : `${property.usable_area} ตร.ม.`, color: 'text-emerald-500 bg-emerald-50'
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

              {property.video_url && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-4">วิดีโอแนะนำทรัพย์</h2>
                  {videoEmbedType === 'youtube' ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                      <iframe
                        src={videoEmbedUrl!}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : videoEmbedType === 'tiktok' ? (
                    <div className="flex justify-center w-full">
                      <iframe
                        src={videoEmbedUrl!}
                        className="w-full max-w-[340px] h-[700px] rounded-xl border border-gray-200 overflow-hidden"
                        allow="encrypted-media"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between border border-gray-100">
                      <div className="text-gray-600 text-sm truncate pr-4">
                        คลิกเพื่อรับชมวิดีโอจากลิงก์ภายนอก
                      </div>
                      <a 
                        href={property.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition-colors"
                      >
                        <Play size={16} fill="currentColor" />
                        เปิดวิดีโอ
                      </a>
                    </div>
                  )}
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
                <div className="w-full h-[300px] bg-gray-100 rounded-xl overflow-hidden border border-gray-200 relative">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(finalMapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
                <div className="mt-4 flex justify-end">
                  <a
                    href={property.map_url || `https://maps.google.com/?q=${encodeURIComponent(property.address || property.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-forest-50 hover:bg-forest-100 text-forest-700 font-medium rounded-xl text-sm transition-colors border border-forest-100"
                  >
                    เปิดในแอป Google Maps
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
                      href={`tel:${settings.phone.replace(/[^0-9]/g, '')}`}
                      className="btn-primary w-full justify-center text-base py-3.5"
                    >
                      <Phone size={18} /> โทร {settings.phone}
                    </a>
                    <a
                      href={settings.lineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle size={18} /> Line สอบถาม
                    </a>
                    <a
                      href={settings.facebookUrl}
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
                      { label: 'รหัสทรัพย์', value: property.property_code || `TBB-${property.id.substring(property.id.length - 6).toUpperCase()}` },
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
