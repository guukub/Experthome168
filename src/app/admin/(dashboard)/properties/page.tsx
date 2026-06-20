'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, Search } from 'lucide-react'
import { Property } from '@/types/property'
import { formatPrice } from '@/lib/utils'
import { getPropertiesAction, deletePropertyAction, updatePropertyStatusAction, togglePropertyVisibleAction, togglePropertyFeaturedAction } from '@/app/actions'

const STATUS_OPTIONS = ['พร้อมขาย', 'จองแล้ว', 'ขายแล้ว']

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'พร้อมขาย' ? 'bg-emerald-100 text-emerald-700' :
    status === 'จองแล้ว' ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-600'
  return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{status}</span>
}

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
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการทรัพย์</h1>
          <p className="text-gray-500 mt-0.5">{properties.length} รายการทั้งหมด</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary">
          <Plus size={18} /> เพิ่มทรัพย์ใหม่
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาทรัพย์..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-9 max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3.5">ทรัพย์</th>
                <th className="px-5 py-3.5">ทำเล</th>
                <th className="px-5 py-3.5">ราคา</th>
                <th className="px-5 py-3.5">สถานะ</th>
                <th className="px-5 py-3.5">แสดง</th>
                <th className="px-5 py-3.5">แนะนำ</th>
                <th className="px-5 py-3.5">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(property => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={property.images?.[0] || ''}
                        alt={property.title}
                        className="w-12 h-10 rounded-lg object-cover shrink-0 bg-gray-100"
                      />
                      <div>
                        <div className="font-medium text-gray-900 text-sm leading-snug max-w-[200px] truncate">{property.title}</div>
                        <div className="text-xs text-gray-400">{property.property_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">{property.location}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-forest-700 whitespace-nowrap">{formatPrice(property.price)}</td>

                  {/* Status dropdown */}
                  <td className="px-5 py-4">
                    <select
                      value={property.status}
                      onChange={e => updateStatus(property.id, e.target.value as Property['status'])}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer outline-none ${
                        property.status === 'พร้อมขาย' ? 'bg-emerald-100 text-emerald-700' :
                        property.status === 'จองแล้ว' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-600'
                      }`}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>

                  {/* Visible toggle */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleVisible(property.id)}
                      title={property.is_visible ? 'ซ่อนทรัพย์นี้' : 'แสดงทรัพย์นี้'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        property.is_visible ? 'text-emerald-600 hover:bg-emerald-50' : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {property.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>

                  {/* Featured toggle */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleFeatured(property.id)}
                      title={property.is_featured ? 'ยกเลิกแนะนำ' : 'ตั้งเป็นแนะนำ'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        property.is_featured ? 'text-gold-500 hover:bg-gold-50' : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {property.is_featured ? <Star size={18} className="fill-gold-400" /> : <StarOff size={18} />}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="p-1.5 text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"
                        title="แก้ไข"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(property.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบ"
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
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">🔍</div>
            <p>ไม่พบทรัพย์ที่ค้นหา</p>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการลบ</h3>
              <p className="text-gray-500 text-sm mb-6">คุณแน่ใจหรือไม่ที่จะลบทรัพย์นี้? ไม่สามารถกู้คืนได้</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 btn-secondary text-sm py-2.5">
                  ยกเลิก
                </button>
                <button
                  onClick={() => deleteProperty(deleteId)}
                  className="flex-1 bg-red-500 text-white font-semibold rounded-xl py-2.5 hover:bg-red-600 transition-colors text-sm"
                >
                  ลบทรัพย์
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
