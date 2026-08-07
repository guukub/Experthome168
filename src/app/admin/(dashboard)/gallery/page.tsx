'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, MapPin, Image as ImageIcon } from 'lucide-react'
import { getPortfoliosAction, deletePortfolioAction, togglePortfolioVisibleAction, PortfolioItemData } from '@/app/portfolioActions'

export default function AdminGalleryPage() {
  const [items, setItems] = useState<PortfolioItemData[]>([])
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    getPortfoliosAction(false).then(setItems)
  }, [])

  const filtered = items.filter(p =>
    p.title.includes(search) || p.location.includes(search) || p.category.includes(search)
  )

  const toggleVisible = async (id: string) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, is_visible: !p.is_visible } : p))
    await togglePortfolioVisibleAction(id)
  }

  const deleteItem = async (id: string) => {
    setItems(prev => prev.filter(p => p.id !== id))
    setDeleteId(null)
    await deletePortfolioAction(id)
  }

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-forest-600 font-bold tracking-widest text-sm uppercase mb-1">
            Gallery Management
          </div>
          <h1 className="text-3xl font-extrabold text-[#0a192f]">
            แกลลอรีผลงาน
            <span className="text-xl font-medium text-gray-400 ml-3">({items.length} รายการ)</span>
          </h1>
        </div>
        <Link href="/admin/gallery/new" className="bg-[#0a192f] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#112a4f] transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={18} /> เพิ่มผลงานใหม่
        </Link>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาผลงานจากชื่อ, สถานที่ หรือหมวดหมู่..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 shadow-sm text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="text-left text-xs text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 bg-gray-50/80">
                <th className="px-6 py-4">ข้อมูลผลงาน</th>
                <th className="px-6 py-4">วันที่</th>
                <th className="px-6 py-4 text-center">การแสดงผล</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden shrink-0 shadow-sm bg-gray-100 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[#0a192f] text-sm leading-snug max-w-[280px] truncate group-hover:text-forest-600 transition-colors">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <span className="font-semibold text-gold-600 bg-gold-50 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <MapPin size={10} /> {item.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      {item.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleVisible(item.id as string)}
                      title={item.is_visible ? 'ซ่อนผลงานนี้' : 'แสดงผลงานนี้'}
                      className={`p-2 rounded-lg transition-colors inline-flex items-center justify-center ${
                        item.is_visible ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {item.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/gallery/${item.id}/edit`}
                        className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        title="แก้ไขข้อมูล"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(item.id as string)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="ลบผลงาน"
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
            <p className="text-lg font-medium text-gray-500">ไม่พบผลงานที่คุณค้นหา</p>
            <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือเพิ่มผลงานใหม่เข้าสู่ระบบ</p>
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
              <p className="text-gray-500 text-sm mb-6">คุณแน่ใจหรือไม่ที่จะลบผลงานนี้? การลบจะไม่สามารถกู้คืนข้อมูลได้</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold rounded-xl py-3 hover:bg-gray-200 transition-colors text-sm">
                  ยกเลิก
                </button>
                <button
                  onClick={() => deleteItem(deleteId)}
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
