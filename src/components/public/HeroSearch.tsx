'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Home, Wallet, ChevronDown, Search, Building2, Map, Folder } from 'lucide-react'
import { PROPERTY_TYPES } from '@/lib/utils'
import locationsData from '@/lib/locations.json'

export default function HeroSearch({ 
  propertyTypes = PROPERTY_TYPES,
  searchSuggestions = []
}: { 
  propertyTypes?: string[]
  searchSuggestions?: string[]
}) {
  const router = useRouter()
  
  const [keyword, setKeyword] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [tambon, setTambon] = useState('')
  
  const [type, setType] = useState('')
  const [price, setPrice] = useState('')

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
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
    let filtered = locationsData
    if (province) filtered = filtered.filter(l => l.province === province)
    return Array.from(new Set(filtered.map(l => l.district))).filter(Boolean).sort()
  }, [province])

  const availableTambons = useMemo(() => {
    let filtered = locationsData
    if (province) filtered = filtered.filter(l => l.province === province)
    if (district) filtered = filtered.filter(l => l.district === district)
    return Array.from(new Set(filtered.map(l => l.tambon))).filter(Boolean).sort()
  }, [province, district])

  const filteredProvinces = useMemo(() => provinces.filter(p => p.toLowerCase().includes(searchTerm.toLowerCase())), [provinces, searchTerm])
  const filteredDistricts = useMemo(() => availableDistricts.filter(d => d.toLowerCase().includes(searchTerm.toLowerCase())), [availableDistricts, searchTerm])
  const filteredTambons = useMemo(() => availableTambons.filter(t => t.toLowerCase().includes(searchTerm.toLowerCase())), [availableTambons, searchTerm])

  const allLocations = useMemo(() => {
    const locs = new Set<string>()
    locationsData.forEach(l => {
      if (l.province) locs.add(l.province)
      if (l.district) locs.add(l.district)
      if (l.tambon) locs.add(l.tambon)
    })
    return Array.from(locs)
  }, [])

  const keywordSuggestions = useMemo(() => {
    if (!keyword || keyword.length < 2) return []
    const lower = keyword.toLowerCase()
    const matches: string[] = []
    
    // 1. Titles and Project Names (Real data from DB)
    for (const title of searchSuggestions) {
      if (matches.length >= 8) break
      if (title.toLowerCase().includes(lower) && !matches.includes(title)) {
        matches.push(title)
      }
    }

    // 2. Property Types
    for (const t of propertyTypes) {
      if (matches.length >= 8) break
      if (t.toLowerCase().includes(lower) && !matches.includes(t)) {
        matches.push(t)
      }
    }
    
    // 3. Locations
    for (const loc of allLocations) {
      if (matches.length >= 8) break
      if (loc.toLowerCase().includes(lower) && !matches.includes(loc)) {
        matches.push(loc)
      }
    }
    
    return matches
  }, [keyword, propertyTypes, allLocations, searchSuggestions])

  const handleProvinceChange = (val: string) => {
    setProvince(val)
    setDistrict('')
    setTambon('')
    setOpenDropdown(null)
  }

  const handleDistrictChange = (val: string) => {
    setDistrict(val)
    setTambon('')
    
    if (val && !province) {
      const match = locationsData.find(l => l.district === val)
      if (match?.province) setProvince(match.province)
    }
    
    setOpenDropdown(null)
  }

  const handleTambonChange = (val: string) => {
    setTambon(val)
    
    if (val) {
      const match = locationsData.find(l => l.tambon === val)
      if (match) {
        if (!district && match.district) setDistrict(match.district)
        if (!province && match.province) setProvince(match.province)
      }
    }
    
    setOpenDropdown(null)
  }

  const toggleDropdown = (name: string | null) => {
    setOpenDropdown(openDropdown === name ? null : name)
    setSearchTerm('')
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (keyword) params.set('q', keyword)
    if (province) params.set('province', province)
    if (district) params.set('district', district)
    if (tambon) params.set('tambon', tambon)
    if (type && type !== 'ทั้งหมด') params.set('type', type)
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

  const propertyTabs = [
    { id: 'ทั้งหมด', label: 'ทั้งหมด', icon: <Home size={16} /> },
    { id: 'บ้านเดี่ยว', label: 'บ้านเดี่ยว', icon: <Home size={16} /> },
    { id: 'ทาวน์โฮม', label: 'ทาวน์โฮม', icon: <Home size={16} /> },
    { id: 'คอนโด', label: 'คอนโด', icon: <Building2 size={16} /> },
    { id: 'ที่ดิน', label: 'ที่ดิน', icon: <MapPin size={16} /> },
  ]

  const displayTypeForMobile = type || 'ทั้งหมด'

  return (
    <div ref={containerRef} className="relative z-30 w-full">
      {/* ==================================================== */}
      {/* DESKTOP VIEW (Original Design)                      */}
      {/* ==================================================== */}
      <div className="hidden md:flex flex-col gap-3 max-w-5xl mx-auto w-full">
        
        {/* Top Row: Keyword Search + Button */}
        <div className="relative bg-[#113123]/95 backdrop-blur-md rounded-full shadow-2xl border border-[#d4af37]/40 p-2 pl-6 flex items-center ring-1 ring-[#d4af37]/20">
          <div className="w-8 h-8 flex items-center justify-center shrink-0 mr-3">
            <Search className="text-[#d4af37]" size={20} />
          </div>
          <div className="flex-1 relative min-w-0 text-left">
            <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">คำค้นหา</div>
            <input
              type="text"
              placeholder="พิมพ์คำค้นหา ทำเล, รหัสทรัพย์, หรือชื่อโครงการ..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full bg-transparent border-none p-0 text-sm text-white placeholder-white/50 focus:ring-0 outline-none h-10"
            />
          </div>
          
          <button 
            onClick={handleSearch}
            className="bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] text-[#0f2a1c] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] px-8 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 shrink-0 group ml-4"
          >
            <Search size={18} className="group-hover:scale-110 transition-transform" />
            <span>ค้นหาทรัพย์</span>
          </button>
          
          {/* Autocomplete Dropdown */}
          {showSuggestions && keywordSuggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] max-h-72 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 custom-scrollbar text-left">
              <div className="py-2">
                {keywordSuggestions.map(suggestion => (
                  <div 
                    key={suggestion}
                    className="px-4 py-2.5 hover:bg-[#d4af37]/20 text-white/90 text-sm cursor-pointer transition-colors flex items-center gap-2"
                    onClick={() => {
                      setKeyword(suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    <Search size={12} className="text-[#d4af37]/60 shrink-0" />
                    <span className="truncate">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row: Filters */}
        <div className="bg-[#113123]/95 backdrop-blur-md rounded-3xl xl:rounded-full shadow-2xl border border-[#d4af37]/40 p-2 flex-col xl:flex-row items-center gap-2 ring-1 ring-[#d4af37]/20 flex">
          
          {/* Province */}
          <div 
            className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none xl:rounded-l-full transition-colors cursor-pointer"
            onClick={() => toggleDropdown('desktop-province')}
          >
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
            <MapPin className="text-[#d4af37]" size={16} />
          </div>
          <div className="flex-1 relative min-w-0 text-left">
            <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">จังหวัด</div>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className={`truncate pr-2 ${province ? "text-white font-medium" : ""}`}>
                {province || 'เลือกจังหวัด'}
              </span>
              <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'desktop-province' ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          {openDropdown === 'desktop-province' && (
            <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] max-h-72 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 custom-scrollbar text-left">
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
              </div>
            </div>
          )}
        </div>

        {/* District */}
        <div 
          className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors cursor-pointer"
          onClick={() => toggleDropdown('desktop-district')}
        >
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
            <Building2 className="text-[#d4af37]" size={16} />
          </div>
          <div className="flex-1 relative min-w-0 text-left">
            <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">เขต/อำเภอ</div>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className={`truncate pr-2 ${district ? "text-white font-medium" : ""}`}>
                {district || 'เลือกอำเภอ'}
              </span>
              <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'desktop-district' ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {openDropdown === 'desktop-district' && (
            <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] max-h-72 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 custom-scrollbar text-left">
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
              </div>
            </div>
          )}
        </div>

        {/* Tambon */}
        <div 
          className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors cursor-pointer"
          onClick={() => toggleDropdown('desktop-tambon')}
        >
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
            <Map className="text-[#d4af37]" size={16} />
          </div>
          <div className="flex-1 relative min-w-0 text-left">
            <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">แขวง/ตำบล</div>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className={`truncate pr-2 ${tambon ? "text-white font-medium" : ""}`}>
                {tambon || 'เลือกตำบล'}
              </span>
              <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'desktop-tambon' ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {openDropdown === 'desktop-tambon' && (
            <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] max-h-72 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 custom-scrollbar text-left">
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
                <div className="px-4 py-2.5 hover:bg-[#d4af37]/20 text-white/90 text-sm cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); handleTambonChange(''); }}>ทุกตำบล</div>
                {filteredTambons.map(t => (
                  <div key={t} className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${tambon === t ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); handleTambonChange(t); }}>{t}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Property Type */}
        <div 
          className="relative flex-1 flex items-center gap-3 px-4 py-3 w-full border-b xl:border-b-0 xl:border-r border-[#d4af37]/20 group hover:bg-white/5 rounded-2xl xl:rounded-none transition-colors cursor-pointer"
          onClick={() => toggleDropdown('desktop-type')}
        >
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
            <Home className="text-[#d4af37]" size={16} />
          </div>
          <div className="flex-1 relative min-w-0 text-left">
            <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">ประเภททรัพย์</div>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className={`truncate pr-2 ${type && type !== 'ทั้งหมด' ? "text-white font-medium" : ""}`}>
                {type && type !== 'ทั้งหมด' ? type : 'เลือกประเภททรัพย์'}
              </span>
              <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'desktop-type' ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {openDropdown === 'desktop-type' && (
            <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] max-h-64 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 py-2 custom-scrollbar text-left">
              <div className="px-4 py-2.5 hover:bg-[#d4af37]/20 text-white/90 text-sm cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); setType(''); toggleDropdown(null); }}>ทุกประเภท</div>
              {propertyTypes.map(t => (
                <div key={t} className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${type === t ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); setType(t); toggleDropdown(null); }}>{t}</div>
              ))}
            </div>
          )}
        </div>

        {/* Price Range */}
        <div 
          className="relative flex-[1.2] flex items-center gap-3 px-4 py-3 w-full group hover:bg-white/5 rounded-2xl xl:rounded-none xl:rounded-r-full transition-colors cursor-pointer"
          onClick={() => toggleDropdown('desktop-price')}
        >
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center shrink-0">
            <Wallet className="text-[#d4af37]" size={16} />
          </div>
          <div className="flex-1 relative min-w-0 text-left">
            <div className="text-[11px] font-medium text-[#d4af37] mb-0.5">ช่วงราคา</div>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className={`truncate pr-2 ${price ? "text-white font-medium" : ""}`}>
                {price === 'under_3m' ? 'ต่ำกว่า 3 ล้าน' : 
                 price === '3m_to_5m' ? '3 - 5 ล้าน' : 
                 price === 'over_5m' ? 'มากกว่า 5 ล้าน' : 
                 'ไม่จำกัดช่วงราคา'}
              </span>
              <ChevronDown size={14} className={`text-[#d4af37]/60 shrink-0 transition-transform ${openDropdown === 'desktop-price' ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {openDropdown === 'desktop-price' && (
            <div className="absolute top-full left-0 xl:-left-10 mt-3 w-full min-w-[220px] max-h-64 overflow-y-auto bg-[#0a1d15] border border-[#d4af37]/40 rounded-2xl shadow-2xl z-50 py-2 custom-scrollbar text-left">
              <div className="px-4 py-2.5 hover:bg-[#d4af37]/20 text-white/90 text-sm cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); setPrice(''); toggleDropdown(null); }}>ไม่จำกัดช่วงราคา</div>
              <div className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${price === 'under_3m' ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); setPrice('under_3m'); toggleDropdown(null); }}>ต่ำกว่า 3 ล้านบาท</div>
              <div className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${price === '3m_to_5m' ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); setPrice('3m_to_5m'); toggleDropdown(null); }}>3 ล้าน - 5 ล้านบาท</div>
              <div className={`px-4 py-2.5 hover:bg-[#d4af37]/20 text-sm cursor-pointer transition-colors ${price === 'over_5m' ? 'text-[#d4af37] font-medium' : 'text-white/90'}`} onClick={(e) => { e.stopPropagation(); setPrice('over_5m'); toggleDropdown(null); }}>มากกว่า 5 ล้านบาท</div>
            </div>
          )}
        </div>
        </div> {/* Close Bottom Row Filters */}
      </div>


      {/* ==================================================== */}
      {/* MOBILE VIEW (New White Card Design)                  */}
      {/* ==================================================== */}
      <div className="block md:hidden bg-[#f4f5f7] rounded-[32px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full text-left">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-[#0a150f] mb-2">
            ค้นหาบ้านที่ใช่ สำหรับคุณ
          </h2>
          <div className="flex items-center gap-2">
            <div className="h-[2px] w-12 bg-[#d4af37]"></div>
            <div className="text-[#d4af37] text-lg leading-none">✦</div>
          </div>
        </div>

        {/* Property Type Pills */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-2 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
          {propertyTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setType(tab.id === 'ทั้งหมด' ? '' : tab.id)}
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 border ${
                displayTypeForMobile === tab.id
                  ? 'bg-white border-gray-300 shadow-sm text-[#0a150f]'
                  : 'bg-[#f8f9fa] border-transparent text-gray-500 hover:bg-gray-100'
              }`}
            >
              <span className={displayTypeForMobile === tab.id ? 'text-[#0a150f]' : 'text-gray-400'}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Grid */}
        <div className="flex flex-col gap-3 mb-6">
          
          {/* Top Row: Keyword (60%) and Location (40%) */}
          <div className="grid grid-cols-5 gap-3">
            {/* Keyword Search */}
            <div className="relative col-span-3">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="ทำเล, รหัสทรัพย์..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full bg-white border border-gray-200 focus:border-gray-300 rounded-xl pl-9 pr-3 py-3 text-xs sm:text-sm text-gray-700 outline-none transition-colors shadow-sm"
              />
              
              {/* Autocomplete Dropdown */}
              {showSuggestions && keywordSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 custom-scrollbar">
                  {keywordSuggestions.map(suggestion => (
                    <div 
                      key={suggestion}
                      className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer text-gray-700 flex items-center gap-2"
                      onClick={() => {
                        setKeyword(suggestion)
                        setShowSuggestions(false)
                      }}
                    >
                      <Search size={12} className="text-gray-400 shrink-0" />
                      <span className="truncate">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Dropdown */}
            <div className="relative col-span-2">
              <div 
                className="w-full h-full bg-white border border-gray-200 rounded-xl px-3 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                onClick={() => toggleDropdown('mobile-province')}
              >
                <div className="flex items-center gap-1.5 text-gray-500 overflow-hidden">
                  <MapPin size={16} className="shrink-0" />
                  <span className={`text-xs sm:text-sm truncate ${province ? 'text-gray-900' : ''}`}>{province || 'ทุกทำเล'}</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${openDropdown === 'mobile-province' ? 'rotate-180' : ''}`} />
              </div>

              {openDropdown === 'mobile-province' && (
                <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] max-h-60 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-xl z-50">
                  <div className="p-2 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <input 
                      type="text" 
                      placeholder="ค้นหา..." 
                      className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                  </div>
                  <div className="py-1">
                    <div className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={() => handleProvinceChange('')}>ทุกทำเล</div>
                    {filteredProvinces.map(p => (
                      <div key={p} className={`px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer ${province === p ? 'font-bold text-forest-700' : ''}`} onClick={(e) => { e.stopPropagation(); handleProvinceChange(p); }}>{p}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Price Only (Property type is handled by pills) */}
          <div className="grid grid-cols-1 gap-3">
            {/* Price Dropdown */}
            <div className="relative">
              <div 
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                onClick={() => toggleDropdown('mobile-price')}
              >
                <div className="flex items-center gap-1.5 text-gray-500 overflow-hidden">
                  <Wallet size={16} className="shrink-0" />
                  <span className={`text-xs sm:text-sm truncate ${price ? 'text-gray-900' : ''}`}>
                    {price === 'under_3m' ? '< 3 ล้าน' : 
                     price === '3m_to_5m' ? '3-5 ล้าน' : 
                     price === 'over_5m' ? '> 5 ล้าน' : 
                     'ช่วงราคา'}
                  </span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 shrink-0 transition-transform ${openDropdown === 'mobile-price' ? 'rotate-180' : ''}`} />
              </div>

              {openDropdown === 'mobile-price' && (
                <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1">
                  <div className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); setPrice(''); toggleDropdown(null); }}>ไม่จำกัดราคา</div>
                  <div className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); setPrice('under_3m'); toggleDropdown(null); }}>ต่ำกว่า 3 ล้าน</div>
                  <div className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); setPrice('3m_to_5m'); toggleDropdown(null); }}>3 - 5 ล้าน</div>
                  <div className="px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer" onClick={(e) => { e.stopPropagation(); setPrice('over_5m'); toggleDropdown(null); }}>มากกว่า 5 ล้าน</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSearch}
          className="w-full bg-[#0a150f] hover:bg-[#112a1f] text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <Search size={18} /> ค้นหาทรัพย์
        </button>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.5); }
        
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
