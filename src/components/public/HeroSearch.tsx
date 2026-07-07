'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Home, Wallet, ChevronDown, Search, Building2, Map } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/utils'
import locationsData from '@/lib/locations.json'

export default function HeroSearch({ propertyTypes = PROPERTY_TYPES }: { propertyTypes?: string[] }) {
  const router = useRouter()
  
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [tambon, setTambon] = useState('')
  
  const [type, setType] = useState('')
  const [price, setPrice] = useState('')

  const provinces = useMemo(() => {
    return Array.from(new Set(locationsData.map(l => l.province))).filter(Boolean).sort()
  }, [])

  const availableDistricts = useMemo(() => {
    if (!province) return []
    return Array.from(new Set(locationsData.filter(l => l.province === province).map(l => l.district))).filter(Boolean).sort()
  }, [province])

  const availableTambons = useMemo(() => {
    if (!district) return []
    return Array.from(new Set(locationsData.filter(l => l.province === province && l.district === district).map(l => l.tambon))).filter(Boolean).sort()
  }, [province, district])

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvince(e.target.value)
    setDistrict('')
    setTambon('')
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value)
    setTambon('')
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (province) params.set('province', province)
    if (district) params.set('district', district)
    if (tambon) params.set('tambon', tambon)
    if (type) params.set('type', type)
    if (price) {
      if (price === 'under_3m') params.set('max_price', '3000000')
      if (price === '3m_to_5m') {
        params.set('min_price', '3000000')
        params.set('max_price', '5000000')
      }
      if (price === 'over_5m') params.set('min_price', '5000000')
    }
    router.push(`/?${params.toString()}#properties`)
  }

  return (
    <div className="bg-[#113123]/95 backdrop-blur-md rounded-3xl xl:rounded-full shadow-2xl border border-[#d4af37]/40 p-2 xl:p-2.5 flex flex-col xl:flex-row items-center gap-2 max-w-6xl mx-auto ring-1 ring-[#d4af37]/20">
      
      {/* Province */}
      <div className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none xl:rounded-l-full transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
          <MapPin className="text-[#d4af37]" size={16} />
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">จังหวัด</div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={`truncate pr-2 ${province ? "text-white font-medium" : ""}`}>
              {province || 'เลือกจังหวัด'}
            </span>
            <ChevronDown size={14} className="text-[#d4af37]/60 shrink-0" />
          </div>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={province}
            onChange={handleProvinceChange}
          >
            <option value="">ทุกจังหวัด</option>
            {provinces.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* District */}
      <div className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
          <Building2 className="text-[#d4af37]" size={16} />
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">เขต/อำเภอ</div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={`truncate pr-2 ${district ? "text-white font-medium" : ""}`}>
              {district || 'เลือกอำเภอ'}
            </span>
            <ChevronDown size={14} className="text-[#d4af37]/60 shrink-0" />
          </div>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={district}
            onChange={handleDistrictChange}
            disabled={!province}
          >
            <option value="">ทุกอำเภอ</option>
            {availableDistricts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tambon */}
      <div className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
          <Map className="text-[#d4af37]" size={16} />
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">แขวง/ตำบล</div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={`truncate pr-2 ${tambon ? "text-white font-medium" : ""}`}>
              {tambon || 'เลือกตำบล'}
            </span>
            <ChevronDown size={14} className="text-[#d4af37]/60 shrink-0" />
          </div>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={tambon}
            onChange={(e) => setTambon(e.target.value)}
            disabled={!district}
          >
            <option value="">ทุกตำบล</option>
            {availableTambons.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Type */}
      <div className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
          <Home className="text-[#d4af37]" size={16} />
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">ประเภททรัพย์</div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={`truncate pr-2 ${type ? "text-white font-medium" : ""}`}>
              {type || 'เลือกประเภททรัพย์'}
            </span>
            <ChevronDown size={14} className="text-[#d4af37]/60 shrink-0" />
          </div>
          <select 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">ทุกประเภท</option>
            {propertyTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
          <Wallet className="text-[#d4af37]" size={16} />
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">ช่วงราคา</div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={`truncate pr-2 ${price ? "text-white font-medium" : ""}`}>
              {price === 'under_3m' ? 'ต่ำกว่า 3 ล้าน' : 
               price === '3m_to_5m' ? '3 - 5 ล้าน' : 
               price === 'over_5m' ? 'มากกว่า 5 ล้าน' : 
               'ไม่จำกัดช่วงราคา'}
            </span>
            <ChevronDown size={14} className="text-[#d4af37]/60 shrink-0" />
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
        className="w-full xl:w-auto bg-gradient-to-r from-[#e3c47a] to-[#d4af37] hover:from-[#d4af37] hover:to-[#b8880f] text-[#0f2a1c] font-bold py-4 xl:py-5 px-8 rounded-2xl xl:rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shrink-0 text-sm transform hover:scale-[1.02]"
      >
        <Search size={18} /> ค้นหาทรัพย์
      </button>
    </div>
  )
}
