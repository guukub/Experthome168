'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

interface AutocompleteSelectProps {
  id: string
  value: string
  onChange: (val: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export default function AutocompleteSelect({ id, value, onChange, options, placeholder, disabled, required }: AutocompleteSelectProps) {
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

  const filteredOptions = options
    .filter(opt => opt.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 50)

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`input flex items-center justify-between cursor-text bg-white ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
        onClick={() => !disabled && setIsOpen(true)}
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
            if (!e.target.value) onChange('') // clear value if emptied
          }}
          onFocus={() => {
            setSearch('')
            setIsOpen(true)
          }}
          disabled={disabled}
          required={required && !value}
          autoComplete="off"
        />
        <ChevronDown size={16} className="text-gray-400 shrink-0" onClick={(e) => {
          e.stopPropagation()
          if (!disabled) setIsOpen(!isOpen)
        }} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <div
                key={opt}
                className="px-4 py-2 hover:bg-forest-50 hover:text-forest-700 cursor-pointer text-sm transition-colors"
                onClick={() => {
                  onChange(opt)
                  setSearch('')
                  setIsOpen(false)
                }}
              >
                {opt}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">ไม่พบข้อมูล</div>
          )}
        </div>
      )}
    </div>
  )
}
