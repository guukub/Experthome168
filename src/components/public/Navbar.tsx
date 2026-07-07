'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, MessageCircle } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState({
    phone: '081-123-4567',
    lineId: '@teebangbon',
    lineUrl: 'https://line.me/ti/p/~@teebangbon',
    logoUrl: ''
  })

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-4 border-b border-gray-100'}`}>
      <div className="container-main">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {settings.logoUrl ? (
              <div className="w-12 h-12 flex items-center justify-center shrink-0 rounded-2xl overflow-hidden bg-white shadow-sm">
                <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-forest-700 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-forest-800 transition-colors shrink-0">
                <span className="text-white font-bold text-xl">ตี๋</span>
              </div>
            )}
            <div>
              <div className="font-bold text-forest-800 text-xl leading-tight">ตี๋บางบอน</div>
              <div className="text-xs text-gray-500 leading-tight tracking-wide mt-0.5">เพื่อนคู่คิด คนหาบ้าน</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-forest-700 font-bold border-b-2 border-forest-700 pb-1">หน้าแรก</Link>
            <Link href="/properties?featured=true" className="text-gray-600 hover:text-forest-700 font-medium transition-colors">ทรัพย์แนะนำ</Link>
            <Link href="/properties?type=บ้านเดี่ยว" className="text-gray-600 hover:text-forest-700 font-medium transition-colors">บ้านขาย</Link>
            <Link href="/properties?type=คอนโด" className="text-gray-600 hover:text-forest-700 font-medium transition-colors">คอนโด</Link>
            <Link href="/properties?type=ที่ดิน" className="text-gray-600 hover:text-forest-700 font-medium transition-colors">ที่ดิน</Link>
            <Link href="/contact" className="text-gray-600 hover:text-forest-700 font-medium transition-colors">ติดต่อเรา</Link>
          </div>

          {/* Contact Badges */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${settings.phone.replace(/\D/g, '')}`}
              className="flex items-center gap-2 px-4 py-2 bg-white text-forest-700 border border-gray-200 rounded-full hover:border-forest-500 hover:text-forest-800 transition-all text-sm font-semibold shadow-sm"
            >
              <Phone size={16} />
              {settings.phone}
            </a>
            <a
              href={settings.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 border border-gray-200 rounded-full hover:border-green-500 hover:text-green-700 transition-all text-sm font-semibold shadow-sm"
            >
              <MessageCircle size={16} />
              {settings.lineId}
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl animate-fade-in">
          <div className="container-main py-4 flex flex-col gap-2">
            <Link href="/" className="px-4 py-3 text-forest-700 font-bold bg-forest-50 rounded-xl" onClick={() => setIsOpen(false)}>
              หน้าแรก
            </Link>
            <Link href="/properties?featured=true" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors" onClick={() => setIsOpen(false)}>
              ทรัพย์แนะนำ
            </Link>
            <Link href="/properties?type=บ้านเดี่ยว" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors" onClick={() => setIsOpen(false)}>
              บ้านขาย
            </Link>
            <Link href="/properties?type=คอนโด" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors" onClick={() => setIsOpen(false)}>
              คอนโด
            </Link>
            <Link href="/properties?type=ที่ดิน" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors" onClick={() => setIsOpen(false)}>
              ที่ดิน
            </Link>
            <Link href="/contact" className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors" onClick={() => setIsOpen(false)}>
              ติดต่อเรา
            </Link>
            
            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3 px-4">
              <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="flex items-center justify-center gap-2 py-3 bg-white text-forest-700 border border-gray-200 rounded-xl font-semibold shadow-sm">
                <Phone size={18} /> โทรหาเรา {settings.phone}
              </a>
              <a href={settings.lineUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-semibold shadow-sm">
                <MessageCircle size={18} /> Line: {settings.lineId}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

