'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Home, Wallet, ChevronDown, Search } from 'lucide-react'
import { PROPERTY_TYPES, LOCATIONS } from '@/lib/utils'

export default function HeroSearch() {
  const router = useRouter()
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [price, setPrice] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (type) params.set('type', type)
    if (price) {
      if (price === 'under_3m') params.set('max_price', '3000000')
      if (price === '3m_to_5m') {
        params.set('min_price', '3000000')
        params.set('max_price', '5000000')
      }
      if (price === 'over_5m') params.set('min_price', '5000000')
    }
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex flex-col md:flex-row items-center gap-2 max-w-5xl mx-auto">
      {/* Location */}
      <div className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100 group">
        <MapPin className="text-gray-400 group-hover:text-forest-600 transition-colors" size={20} />
        <div className="flex-1 relative">
          <div className="text-xs font-bold text-gray-900 mb-0.5">ทำเล</div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className={location ? "text-gray-900 font-medium" : ""}>
              {location || 'เลือกทำเล / เขต / อำเภอ'}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">ทุกทำเล</option>
            {LOCATIONS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Type */}
      <div className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b md:border-b-0 md:border-r border-gray-100 group">
        <Home className="text-gray-400 group-hover:text-forest-600 transition-colors" size={20} />
        <div className="flex-1 relative">
          <div className="text-xs font-bold text-gray-900 mb-0.5">ประเภททรัพย์</div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className={type ? "text-gray-900 font-medium" : ""}>
              {type || 'เลือกประเภททรัพย์'}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">ทุกประเภท</option>
            {PROPERTY_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full group">
        <Wallet className="text-gray-400 group-hover:text-forest-600 transition-colors" size={20} />
        <div className="flex-1 relative">
          <div className="text-xs font-bold text-gray-900 mb-0.5">ช่วงราคา</div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className={price ? "text-gray-900 font-medium" : ""}>
              {price === 'under_3m' ? 'ต่ำกว่า 3 ล้าน' : 
               price === '3m_to_5m' ? '3 - 5 ล้าน' : 
               price === 'over_5m' ? 'มากกว่า 5 ล้าน' : 
               'ไม่จำกัดช่วงราคา'}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          >
            <option value="">ไม่จำกัดช่วงราคา</option>
            <option value="under_3m">ต่ำกว่า 3 ล้านบาท</option>
            <option value="3m_to_5m">3 ล้าน - 5 ล้านบาท</option>
            <option value="over_5m">มากกว่า 5 ล้านบาท</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button 
        onClick={handleSearch}
        className="w-full md:w-auto bg-forest-700 hover:bg-forest-800 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0"
      >
        <Search size={18} /> ค้นหาทรัพย์
      </button>
    </div>
  )
}
