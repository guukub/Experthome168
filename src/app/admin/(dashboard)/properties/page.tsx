'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, Search, MapPin, ExternalLink } from 'lucide-react'
import { Property } from '@/types/property'
import { formatPrice } from '@/lib/utils'
import { getPropertiesAction, deletePropertyAction, updatePropertyStatusAction, togglePropertyVisibleAction, togglePropertyFeaturedAction } from '@/app/actions'

const STATUS_OPTIONS = ['พร้อมขาย', 'จองแล้ว', 'ขายแล้ว']

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    getPropertiesAction().then(setProperties)
  }, [])

  const filtered = properties.filter(p =>
    p.title.includes(search) || p.location.includes(search) || p.property_type.includes(search)
  )

  const updateStatus = async (id: string, status: Property['status']) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    await updatePropertyStatusAction(id, status)
  }

  const toggleVisible = async (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, is_visible: !p.is_visible } : p))
    await togglePropertyVisibleAction(id)
  }

  const toggleFeatured = async (id: string) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, is_featured: !p.is_featured } : p))
    await togglePropertyFeaturedAction(id)
  }

  const deleteProperty = async (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id))
    setDeleteId(null)
    await deletePropertyAction(id)
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-forest-600 font-bold tracking-widest text-sm uppercase mb-1">
            Property Management
          </div>
          <h1 className="text-3xl font-extrabold text-[#0a192f]">
            จัดการทรัพย์ทั้งหมด
            <span className="text-xl font-medium text-gray-400 ml-3">({properties.length} รายการ)</span>
          </h1>
        </div>
        <Link href="/admin/properties/new" className="bg-[#0a192f] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#112a4f] transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} /> เพิ่มทรัพย์ใหม่
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาทรัพย์จากชื่อ, ทำเล หรือประเภท..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 shadow-sm text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left text-xs text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 bg-gray-50/80">
                <th className="px-6 py-4">ข้อมูลทรัพย์</th>
                <th className="px-6 py-4">ราคา</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-center">การแสดงผล</th>
                <th className="px-6 py-4 text-center">แนะนำ</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(property => (
                <tr key={property.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm">
                        <img
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=80'}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-[#0a192f] text-sm leading-snug max-w-[280px] truncate group-hover:text-forest-600 transition-colors">
                          {property.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="font-semibold text-forest-600 bg-forest-50 px-2 py-0.5 rounded">
                            {property.property_type}
                          </span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <MapPin size={10} /> {property.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-extrabold text-[#0a192f] whitespace-nowrap">
                      {formatPrice(property.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={property.status}
                      onChange={e => updateStatus(property.id, e.target.value as Property['status'])}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none shadow-sm ${
                        property.status === 'พร้อมขาย' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                        property.status === 'จองแล้ว' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                        'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleVisible(property.id)}
                      title={property.is_visible ? 'ซ่อนทรัพย์นี้' : 'แสดงทรัพย์นี้'}
                      className={`p-2 rounded-lg transition-colors inline-flex items-center justify-center ${
                        property.is_visible ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {property.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleFeatured(property.id)}
                      title={property.is_featured ? 'ยกเลิกแนะนำ' : 'ตั้งเป็นแนะนำ'}
                      className={`p-2 rounded-lg transition-colors inline-flex items-center justify-center ${
                        property.is_featured ? 'text-gold-600 bg-gold-50 hover:bg-gold-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {property.is_featured ? <Star size={18} className="fill-gold-400" /> : <StarOff size={18} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/properties/${property.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                        title="ดูหน้าเว็บ"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        title="แก้ไขข้อมูล"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(property.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="ลบทรัพย์"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 flex flex-col items-center">
            <Search size={48} className="mb-4 text-gray-200" />
            <p className="text-lg font-medium text-gray-500">ไม่พบทรัพย์ที่คุณค้นหา</p>
            <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือเพิ่มทรัพย์ใหม่เข้าสู่ระบบ</p>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0a192f]/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full animate-slide-up">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-red-100">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-xl font-extrabold text-[#0a192f] mb-2">ยืนยันการลบ</h3>
              <p className="text-gray-500 text-sm mb-6">คุณแน่ใจหรือไม่ที่จะลบทรัพย์นี้? การลบจะไม่สามารถกู้คืนข้อมูลได้</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold rounded-xl py-3 hover:bg-gray-200 transition-colors text-sm">
                  ยกเลิก
                </button>
                <button
                  onClick={() => deleteProperty(deleteId)}
                  className="flex-1 bg-red-500 text-white font-bold rounded-xl py-3 hover:bg-red-600 transition-colors text-sm shadow-sm shadow-red-500/30"
                >
                  ลบทิ้งถาวร
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
