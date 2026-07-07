'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
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

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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

  const filteredProvinces = useMemo(() => provinces.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase())), [provinces, searchTerm])
  const filteredDistricts = useMemo(() => availableDistricts.filter(d => d.toLowerCase().includes(searchTerm.toLowerCase())), [availableDistricts, searchTerm])
  const filteredTambons = useMemo(() => availableTambons.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())), [availableTambons, searchTerm])

  const handleProvinceChange = (val: string) => {
    setProvince(val)
    setDistrict('')
    setTambon('')
    setOpenDropdown(null)
  }

  const handleDistrictChange = (val: string) => {
    setDistrict(val)
    setTambon('')
    setOpenDropdown(null)
  }

  const toggleDropdown = (name: string | null) => {
    setOpenDropdown(openDropdown === name ? null : name)
    setSearchTerm('')
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
    <div ref={containerRef} className="bg-[#113123]/95 backdrop-blur-md rounded-3xl xl:rounded-full shadow-2xl border border-[#d4af37]/40 p-2 xl:p-2.5 flex flex-col xl:flex-row items-center gap-2 max-w-6xl mx-auto ring-1 ring-[#d4af37]/20 relative z-30">
      
      {/* Province */}
      <div 
        className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none xl:rounded-l-full transition-colors cursor-pointer"
        onClick={() => toggleDropdown('province')}
      >
        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
          <MapPin className="text-[#d4af37]" size={16} />
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">จังหวัด</div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={`truncate pr-2 ${province ? "text-white font-medium" : ""}`}>
              {province || 'เลือกจังหวัด'}
            </span>
            <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'province' ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        {openDropdown === 'province' && (
          <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] max-h-72 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 custom-scrollbar">
            <div className="p-2 border-b border-[#d4af37]/20 sticky top-0 bg-[#0a1d15] z-10">
              <input 
                type="text" 
                placeholder="ค้นหาจังหวัด..." 
                className="w-full bg-white/5 text-white placeholder-white/40 border border-[#d4af37]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="py-2">
              <div className="px-4 py-2.5 hover:bg-[#d4af37]/20 text-white/90 text-sm cursor-pointer transition-colors" onClick={() => handleProvinceChange('')}>ทุกจังหวัด</div>
              {filteredProvinces.map(p => (
                <div key={p} className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${province === p ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); handleProvinceChange(p); }}>{p}</div>
              ))}
              {filteredProvinces.length === 0 && (
                <div className="px-4 py-3 text-sm text-white/50 text-center">ไม่พบข้อมูล</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* District */}
      <div 
        className={`relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors ${!province ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => {
          if (!province) return;
          toggleDropdown('district')
        }}
      >
        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
          <Building2 className="text-[#d4af37]" size={16} />
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">เขต/อำเภอ</div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={`truncate pr-2 ${district ? "text-white font-medium" : ""}`}>
              {district || 'เลือกอำเภอ'}
            </span>
            <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'district' ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {openDropdown === 'district' && province && (
          <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] max-h-72 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 custom-scrollbar">
            <div className="p-2 border-b border-[#d4af37]/20 sticky top-0 bg-[#0a1d15] z-10">
              <input 
                type="text" 
                placeholder="ค้นหาอำเภอ..." 
                className="w-full bg-white/5 text-white placeholder-white/40 border border-[#d4af37]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="py-2">
              <div className="px-4 py-2.5 hover:bg-[#d4af37]/20 text-white/90 text-sm cursor-pointer transition-colors" onClick={() => handleDistrictChange('')}>ทุกอำเภอ</div>
              {filteredDistricts.map(d => (
                <div key={d} className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${district === d ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); handleDistrictChange(d); }}>{d}</div>
              ))}
              {filteredDistricts.length === 0 && (
                <div className="px-4 py-3 text-sm text-white/50 text-center">ไม่พบข้อมูล</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tambon */}
      <div 
        className={`relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors ${!district ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => {
          if (!district) return;
          toggleDropdown('tambon')
        }}
      >
        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
          <Map className="text-[#d4af37]" size={16} />
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">แขวง/ตำบล</div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={`truncate pr-2 ${tambon ? "text-white font-medium" : ""}`}>
              {tambon || 'เลือกตำบล'}
            </span>
            <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'tambon' ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {openDropdown === 'tambon' && district && (
          <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] max-h-72 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 custom-scrollbar">
            <div className="p-2 border-b border-[#d4af37]/20 sticky top-0 bg-[#0a1d15] z-10">
              <input 
                type="text" 
                placeholder="ค้นหาตำบล..." 
                className="w-full bg-white/5 text-white placeholder-white/40 border border-[#d4af37]/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#d4af37] focus:bg-white/10 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <div className="py-2">
              <div className="px-4 py-2.5 hover:bg-[#d4af37]/20 text-white/90 text-sm cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); setTambon(''); toggleDropdown(null); }}>ทุกตำบล</div>
              {filteredTambons.map(t => (
                <div key={t} className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${tambon === t ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); setTambon(t); toggleDropdown(null); }}>{t}</div>
              ))}
              {filteredTambons.length === 0 && (
                <div className="px-4 py-3 text-sm text-white/50 text-center">ไม่พบข้อมูล</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Property Type */}
      <div 
        className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors cursor-pointer"
        onClick={() => toggleDropdown('type')}
      >
        <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
          <Home className="text-[#d4af37]" size={16} />
        </div>
        <div className="flex-1 relative min-w-0">
          <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">ประเภททรัพย์</div>
          <div className="flex items-center justify-between text-xs text-white/70">
            <span className={`truncate pr-2 ${type ? "text-white font-medium" : ""}`}>
              {type || 'เลือกประเภททรัพย์'}
            </span>
            <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {openDropdown === 'type' && (
          <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] max-h-64 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 py-2 custom-scrollbar">
            <div className="px-4 py-2.5 hover:bg-[#d4af37]/20 text-white/90 text-sm cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); setType(''); toggleDropdown(null); }}>ทุกประเภท</div>
            {propertyTypes.map(t => (
              <div key={t} className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${type === t ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); setType(t); toggleDropdown(null); }}>{t}</div>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div 
        className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors cursor-pointer"
        onClick={() => toggleDropdown('price')}
      >
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
            <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {openDropdown === 'price' && (
          <div className="absolute top-full left-0 xl:-left-10 mt-3 w-full min-w-[220px] max-h-64 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 py-2 custom-scrollbar">
            <div className="px-4 py-2.5 hover:bg-[#d4af37]/20 text-white/90 text-sm cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); setPrice(''); toggleDropdown(null); }}>ไม่จำกัดช่วงราคา</div>
            <div className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${price === 'under_3m' ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); setPrice('under_3m'); toggleDropdown(null); }}>ต่ำกว่า 3 ล้านบาท</div>
            <div className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${price === '3m_to_5m' ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); setPrice('3m_to_5m'); toggleDropdown(null); }}>3 ล้าน - 5 ล้านบาท</div>
            <div className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${price === 'over_5m' ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); setPrice('over_5m'); toggleDropdown(null); }}>มากกว่า 5 ล้านบาท</div>
          </div>
        )}
      </div>

      {/* Search Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); handleSearch(); }}
        className="w-full xl:w-auto bg-gradient-to-r from-[#e3c47a] to-[#d4af37] hover:from-[#d4af37] hover:to-[#b8880f] text-[#0f2a1c] font-bold py-4 xl:py-5 px-8 rounded-2xl xl:rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shrink-0 text-sm transform hover:scale-[1.02]"
      >
        <Search size={18} /> ค้นหาทรัพย์
      </button>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
    </div>
  )
}
