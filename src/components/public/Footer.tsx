'use client'

import { Phone, MessageCircle, Facebook } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Footer() {
  const [settings, setSettings] = useState({
    phone: '081-123-4567',
    lineId: '@teebangbon',
    lineUrl: 'https://line.me/ti/p/~@teebangbon',
    facebook: 'facebook.com/teebangbon',
    facebookUrl: 'https://facebook.com/teebangbon',
    tiktok: '',
    tiktokUrl: '',
    logoUrl: ''
  })

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings)
  }, [])

  return (
    <footer className="bg-forest-800 text-white py-8">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          
          {/* Logo & Description */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <Image src={settings.logoUrl} alt="Logo" fill className="object-cover" sizes="48px" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0">
                  <span className="text-forest-800 font-bold text-xl">ตี๋</span>
                </div>
              )}
              <div className="whitespace-nowrap">
                <div className="font-bold text-white text-xl leading-tight">ตี๋บางบอน</div>
                <div className="text-xs text-forest-200 leading-tight tracking-wide mt-0.5">เพื่อนคู่คิด คนหาบ้าน</div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-forest-600 mx-2 shrink-0"></div>
            <div className="flex flex-col gap-3 max-w-xs shrink-0 text-left">
              <p className="text-sm text-forest-100 leading-relaxed">
                ศูนย์รวมบ้านมือสองคุณภาพ คัดสรรทุกหลัง<br/>ด้วยความใส่ใจ เพื่อให้คุณได้บ้านที่ใช่
              </p>
              <Link href="/services/sell-property" className="text-gold-400 hover:text-gold-300 font-semibold text-sm transition-colors w-fit">
                รับฝากขายบ้าน คอนโด และที่ดิน
              </Link>
            </div>
          </div>

          {/* Contacts */}
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-center lg:justify-end gap-6 lg:gap-8">
            <div className="flex items-center gap-3">
              <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="w-10 h-10 bg-white text-forest-800 rounded-full flex items-center justify-center hover:bg-forest-50 transition-colors shrink-0">
                <Phone size={18} />
              </a>
              <div className="whitespace-nowrap">
                <a href={`tel:${settings.phone.replace(/\D/g, '')}`} className="font-bold block hover:text-forest-200 transition-colors">{settings.phone}</a>
                <span className="text-xs text-forest-200">ทุกวัน 09.00 - 18.00 น.</span>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-10 bg-forest-600"></div>

            <div className="flex items-center gap-3">
              <a href={settings.lineUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-green-600 rounded-full flex items-center justify-center hover:bg-forest-50 transition-colors shrink-0">
                <span className="font-extrabold text-[10px]">LINE</span>
              </a>
              <div className="whitespace-nowrap">
                <a href={settings.lineUrl} target="_blank" rel="noopener noreferrer" className="font-bold block hover:text-forest-200 transition-colors">{settings.lineId}</a>
                <span className="text-xs text-forest-200">ตอบไว แชทได้เลย</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-forest-600"></div>

            <div className="flex items-center gap-3">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center hover:bg-forest-50 transition-colors shrink-0">
                <Facebook size={18} />
              </a>
              <div className="whitespace-nowrap">
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="font-bold block hover:text-forest-200 transition-colors">{settings.facebook}</a>
                <span className="text-xs text-forest-200">ติดตามทรัพย์ใหม่ก่อนใคร</span>
              </div>
            </div>

            {settings.tiktokUrl && (
              <>
                <div className="hidden sm:block w-px h-10 bg-forest-600"></div>
                <div className="flex items-center gap-3">
                  <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-forest-50 transition-colors shrink-0 font-bold text-lg">
                    <span className="mt-0.5">🎵</span>
                  </a>
                  <div className="whitespace-nowrap">
                    <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="font-bold block hover:text-forest-200 transition-colors">{settings.tiktok}</a>
                    <span className="text-xs text-forest-200">รีวิวบ้านแบบวิดีโอสั้น</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

