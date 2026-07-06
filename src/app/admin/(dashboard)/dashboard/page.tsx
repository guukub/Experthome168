import Link from 'next/link'
import { Plus, Eye, TrendingUp, CheckCircle, Clock, XCircle, Building2 } from 'lucide-react'
import { getPropertiesAction } from '@/app/actions'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboardPage() {
  const allProps = await getPropertiesAction()
  const visibleProperties = allProps.filter(p => p.is_visible)
  const available = allProps.filter(p => p.status === 'พร้อมขาย')
  const reserved = allProps.filter(p => p.status === 'จองแล้ว')
  const sold = allProps.filter(p => p.status === 'ขายแล้ว')
  const hidden = allProps.filter(p => !p.is_visible)
  const featured = allProps.filter(p => p.is_featured)

  const stats = [
    { label: 'ทรัพย์ทั้งหมด', value: allProps.length, icon: Building2, color: 'text-blue-600 bg-blue-50', border: 'border-blue-100' },
    { label: 'พร้อมขาย', value: available.length, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50', border: 'border-emerald-100' },
    { label: 'จองแล้ว', value: reserved.length, icon: Clock, color: 'text-amber-600 bg-amber-50', border: 'border-amber-100' },
    { label: 'ขายแล้ว', value: sold.length, icon: XCircle, color: 'text-red-600 bg-red-50', border: 'border-red-100' },
  ]

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">ภาพรวม</h1>
          <p className="text-gray-500 mt-1">ยินดีต้อนรับสู่ระบบจัดการ ตี๋บางบอน</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">
          <Plus size={18} /> เพิ่มทรัพย์ใหม่
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`bg-white rounded-2xl p-5 border ${stat.border} shadow-sm`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/properties/new" className="flex items-center gap-4 p-5 bg-forest-600 text-white rounded-2xl hover:bg-forest-700 transition-colors group">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={22} />
          </div>
          <div>
            <div className="font-bold">เพิ่มทรัพย์ใหม่</div>
            <div className="text-forest-100 text-sm">ลงประกาศทรัพย์ใหม่</div>
          </div>
        </Link>
        <Link href="/admin/properties" className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-forest-50 group-hover:scale-110 transition-all">
            <Building2 size={22} className="text-gray-600 group-hover:text-forest-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900">จัดการทรัพย์</div>
            <div className="text-gray-500 text-sm">{allProps.length} รายการทั้งหมด</div>
          </div>
        </Link>
        <Link href="/" target="_blank" className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:scale-110 transition-all">
            <Eye size={22} className="text-gray-600 group-hover:text-blue-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900">ดูหน้าเว็บ</div>
            <div className="text-gray-500 text-sm">เปิดในแท็บใหม่</div>
          </div>
        </Link>
      </div>

      {/* Recent Properties Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-lg">รายการทรัพย์ล่าสุด</h2>
          <Link href="/admin/properties" className="text-sm text-forest-600 hover:text-forest-700 font-medium">
            ดูทั้งหมด →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-5 py-3">ทรัพย์</th>
                <th className="px-5 py-3">ทำเล</th>
                <th className="px-5 py-3">ราคา</th>
                <th className="px-5 py-3">สถานะ</th>
                <th className="px-5 py-3">แสดง</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allProps.slice(0, 6).map(property => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {property.images?.[0] && (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                      )}
                      <div>
                        <div className="font-medium text-gray-900 text-sm line-clamp-1">{property.title}</div>
                        <div className="text-xs text-gray-400">{property.property_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{property.location}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-forest-700">{formatPrice(property.price)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={property.status} />
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-sm font-medium ${property.is_visible ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {property.is_visible ? '✓ แสดง' : '✗ ซ่อน'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/properties/${property.id}/edit`} className="text-sm text-forest-600 hover:text-forest-700 font-medium">
                      แก้ไข
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Misc Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-gold-500" />
            <h3 className="font-bold text-gray-900">สถิติ</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between text-gray-600">
              <span>ทรัพย์แนะนำ</span>
              <span className="font-semibold text-gray-900">{featured.length} รายการ</span>
            </li>
            <li className="flex justify-between text-gray-600">
              <span>ทรัพย์ซ่อนอยู่</span>
              <span className="font-semibold text-gray-900">{hidden.length} รายการ</span>
            </li>
            <li className="flex justify-between text-gray-600">
              <span>ทรัพย์ที่มองเห็น</span>
              <span className="font-semibold text-gray-900">{visibleProperties.length} รายการ</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-forest-600 to-forest-800 rounded-2xl p-5 text-white">
          <h3 className="font-bold mb-3">ต้องการความช่วยเหลือ?</h3>
          <p className="text-forest-100 text-sm mb-4">เพิ่มทรัพย์ใหม่ แก้ไขสถานะ หรือจัดการรูปภาพได้ทันที</p>
          <Link href="/admin/properties/new" className="inline-flex items-center gap-2 bg-white text-forest-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-warm-100 transition-colors">
            <Plus size={15} /> เพิ่มทรัพย์ใหม่
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'พร้อมขาย' ? 'bg-emerald-100 text-emerald-700' :
    status === 'จองแล้ว' ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-600'
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  )
}
