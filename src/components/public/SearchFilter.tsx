'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { PROPERTY_TYPES, PROPERTY_STATUSES, LOCATIONS } from '@/lib/utils'

export default function SearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isExpanded, setIsExpanded] = useState(false)

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    status: searchParams.get('status') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
  })

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    router.push(`/properties?${params.toString()}`)
  }, [filters, router])

  const clearFilters = () => {
    setFilters({ type: '', location: '', status: '', min_price: '', max_price: '' })
    router.push('/properties')
  }

  const hasFilters = Object.values(filters).some(v => v !== '')

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
      {/* Main search row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <select
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
            className="select"
          >
            <option value="">🏠 ประเภทอสังหาฯ ทั้งหมด</option>
            {PROPERTY_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <select
            value={filters.location}
            onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
            className="select"
          >
            <option value="">📍 ทุกทำเล</option>
            {LOCATIONS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <select
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="select"
          >
            <option value="">🏷️ ทุกสถานะ</option>
            {PROPERTY_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 font-medium text-sm"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">ราคา</span>
          </button>
          <button
            onClick={applyFilters}
            className="btn-primary py-3 px-6 text-sm"
          >
            <Search size={16} />
            ค้นหา
          </button>
        </div>
      </div>

      {/* Price range (expanded) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 animate-fade-in">
          <div className="flex-1">
            <label className="label">ราคาต่ำสุด (บาท)</label>
            <input
              type="number"
              placeholder="0"
              value={filters.min_price}
              onChange={e => setFilters(f => ({ ...f, min_price: e.target.value }))}
              className="input"
            />
          </div>
          <div className="flex-1">
            <label className="label">ราคาสูงสุด (บาท)</label>
            <input
              type="number"
              placeholder="ไม่จำกัด"
              value={filters.max_price}
              onChange={e => setFilters(f => ({ ...f, max_price: e.target.value }))}
              className="input"
            />
          </div>
        </div>
      )}

      {/* Active filter tags */}
      {hasFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">ตัวกรอง:</span>
          {filters.type && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-forest-50 text-forest-700 rounded-full text-xs font-medium border border-forest-100">
              {filters.type}
              <button onClick={() => setFilters(f => ({ ...f, type: '' }))}><X size={10} /></button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-forest-50 text-forest-700 rounded-full text-xs font-medium border border-forest-100">
              {filters.location}
              <button onClick={() => setFilters(f => ({ ...f, location: '' }))}><X size={10} /></button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-forest-50 text-forest-700 rounded-full text-xs font-medium border border-forest-100">
              {filters.status}
              <button onClick={() => setFilters(f => ({ ...f, status: '' }))}><X size={10} /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto">
            ล้างทั้งหมด
          </button>
        </div>
      )}
    </div>
  )
}
