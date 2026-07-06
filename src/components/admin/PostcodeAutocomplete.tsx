'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface LocationData {
  province: string
  district: string
  tambon: string
  postCode: string
}

interface PostcodeAutocompleteProps {
  id: string
  value: string
  onChange: (val: string) => void
  onSelectLocation: (loc: LocationData) => void
  locations: LocationData[]
  placeholder?: string
  required?: boolean
}

export default function PostcodeAutocomplete({
  id,
  value,
  onChange,
  onSelectLocation,
  locations,
  placeholder,
  required
}: PostcodeAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter locations by postcode
  const filteredOptions = search.length > 0
    ? locations.filter(loc => loc.postCode?.toString().includes(search)).slice(0, 50) // limit to 50
    : []

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`input flex items-center justify-between cursor-text bg-white`}
        onClick={() => setIsOpen(true)}
      >
        <input
          id={id}
          type="text"
          className="w-full outline-none bg-transparent"
          placeholder={placeholder}
          value={isOpen ? search : value}
          onChange={e => {
            setSearch(e.target.value)
            setIsOpen(true)
            onChange(e.target.value)
          }}
          onFocus={() => {
            setSearch('')
            setIsOpen(true)
          }}
          required={required && !value}
          autoComplete="off"
        />
        <ChevronDown size={16} className="text-gray-400 shrink-0" onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }} />
      </div>

      {isOpen && search.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <div
                key={`${opt.postCode}-${opt.district}-${opt.tambon}-${i}`}
                className="px-4 py-2 hover:bg-forest-50 hover:text-forest-700 cursor-pointer text-sm transition-colors border-b border-gray-50 last:border-0"
                onClick={() => {
                  onSelectLocation(opt)
                  onChange(opt.postCode)
                  setSearch('')
                  setIsOpen(false)
                }}
              >
                <div className="font-semibold text-forest-700">{opt.postCode}</div>
                <div className="text-xs text-gray-500">
                  ต.{opt.tambon} อ.{opt.district} จ.{opt.province}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">ไม่พบรหัสไปรษณีย์นี้</div>
          )}
        </div>
      )}
    </div>
  )
}
