import { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PropertyCard from '@/components/public/PropertyCard'
import SearchFilter from '@/components/public/SearchFilter'
import { getPropertiesAction, getSettingsAction } from '@/app/actions'
import { SearchFilters } from '@/types/property'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ทรัพย์ทั้งหมด',
  description: 'ค้นหาบ้านเดี่ยว ทาวน์เฮ้าส์ คอนโด ที่ดิน ในย่านบางบอนและพื้นที่ใกล้เคียง',
}

interface PropertiesPageProps {
  searchParams: {
    type?: string
    location?: string
    status?: string
    min_price?: string
    max_price?: string
  }
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const allProps = await getPropertiesAction()
  const settings = await getSettingsAction()
  const visibleProperties = allProps.filter(p => p.is_visible)
  
  // Filter properties based on search params
  let filtered = visibleProperties

  if (searchParams.type) {
    filtered = filtered.filter(p => p.property_type === searchParams.type)
  }
  if (searchParams.location) {
    filtered = filtered.filter(p => p.location === searchParams.location)
  }
  if (searchParams.status) {
    filtered = filtered.filter(p => p.status === searchParams.status)
  }
  if (searchParams.min_price) {
    filtered = filtered.filter(p => p.price >= Number(searchParams.min_price))
  }
  if (searchParams.max_price) {
    filtered = filtered.filter(p => p.price <= Number(searchParams.max_price))
  }

  const hasFilters = Object.values(searchParams).some(v => v)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-forest-800 to-forest-950 text-white py-14 px-4">
          <div className="container-main">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">ทรัพย์ทั้งหมด</h1>
            <p className="text-forest-200 text-lg">บ้านเดี่ยว · ทาวน์เฮ้าส์ · คอนโด · ที่ดิน — พร้อมขาย พร้อมโอน</p>
          </div>
        </div>

        <div className="container-main py-10">
          {/* Search & Filter */}
          <div className="mb-8">
            <Suspense fallback={<div className="h-20 bg-white rounded-2xl animate-pulse" />}>
              <SearchFilter propertyTypes={settings?.propertyTypes} />
            </Suspense>
          </div>

          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-700 font-semibold text-lg">
                {filtered.length === 0 ? 'ไม่พบทรัพย์' : `พบ ${filtered.length} รายการ (v2)`}
              </p>
              {hasFilters && (
                <p className="text-sm text-gray-500 mt-0.5">ผลการกรอง</p>
              )}
            </div>

            {/* Status summary chips */}
            <div className="hidden sm:flex items-center gap-2">
              {[
                { label: 'พร้อมขาย', color: 'bg-emerald-100 text-emerald-700', count: visibleProperties.filter(p => p.status === 'พร้อมขาย').length },
                { label: 'จองแล้ว', color: 'bg-amber-100 text-amber-700', count: visibleProperties.filter(p => p.status === 'จองแล้ว').length },
                { label: 'ขายแล้ว', color: 'bg-red-100 text-red-600', count: visibleProperties.filter(p => p.status === 'ขายแล้ว').length },
              ].map(s => (
                <span key={s.label} className={`px-3 py-1 rounded-full text-xs font-semibold ${s.color}`}>
                  {s.label} ({s.count})
                </span>
              ))}
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filtered.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🏡</div>
              <h2 className="text-xl font-bold text-gray-700 mb-2">ไม่พบทรัพย์ที่ค้นหา</h2>
              <p className="text-gray-500 mb-6">ลองเปลี่ยนตัวกรองหรือติดต่อเราเพื่อสอบถามทรัพย์ที่ต้องการ</p>
              <a href="tel:+66812345678" className="btn-primary">โทรสอบถาม</a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
