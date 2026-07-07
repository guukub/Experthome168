import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PropertyCard from '@/components/public/PropertyCard'

import { getPropertiesAction, getSettingsAction } from '@/app/actions'
import { ArrowRight, Search, MapPin, Home, Wallet, ChevronDown, Calendar, Building, Landmark, CheckCircle2, Megaphone, CheckCircle, Shield, Users, TrendingUp, Clock } from 'lucide-react'
import HeroSearch from '@/components/public/HeroSearch'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'หน้าแรก | ตี๋บางบอน อสังหาริมทรัพย์',
  description: 'ตี๋บางบอน — ผู้เชี่ยวชาญอสังหาริมทรัพย์ย่านบางบอน หนองแขม พุทธบูชา บ้านเดี่ยว ทาวน์เฮ้าส์ ที่ดิน ราคาดี พร้อมให้บริการ',
}

interface HomePageProps {
  searchParams: {
    type?: string
    province?: string
    district?: string
    tambon?: string
    min_price?: string
    max_price?: string
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const allProps = await getPropertiesAction()
  const settings = await getSettingsAction()
  const portfolioImages = settings?.portfolioImages || []
  let filtered = allProps.filter(p => p.is_visible)

  if (searchParams.type) {
    filtered = filtered.filter(p => p.property_type === searchParams.type)
  }
  if (searchParams.province) {
    filtered = filtered.filter(p => p.province === searchParams.province)
  }
  if (searchParams.district) {
    filtered = filtered.filter(p => p.district === searchParams.district)
  }
  if (searchParams.tambon) {
    filtered = filtered.filter(p => p.tambon === searchParams.tambon)
  }
  if (searchParams.min_price) {
    filtered = filtered.filter(p => p.price >= Number(searchParams.min_price))
  }
  if (searchParams.max_price) {
    filtered = filtered.filter(p => p.price <= Number(searchParams.max_price))
  }

  return (
    <>
      <Navbar />
      <main className="bg-warm-50 min-h-screen">
        {/* ─── HERO SECTION ─── */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${settings?.heroBgUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80'}')`,
            }}
          />
          <div className="absolute inset-0 bg-[#0a150f]/60" /> {/* Dark overlay for premium look */}

          <div className="relative z-10 container-main flex flex-col items-center text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 drop-shadow-md">
              ค้นหาบ้านที่ใช่ สำหรับคุณ
            </h1>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#d4af37]"></div>
              <div className="text-[#d4af37] text-xl">✦</div>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#d4af37]"></div>
            </div>

            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-10 font-medium drop-shadow-md">
              หาง่าย ครบ จบในที่เดียว
            </p>

            {/* Search Bar - Lifted up to overlap the hero section */}
            <div className="w-full relative z-20 mb-8">
              <HeroSearch propertyTypes={settings?.propertyTypes} />
            </div>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Link href="/properties" className="bg-[#f9f6ef] hover:bg-white text-[#0f2a1c] px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                <Search size={16} className="text-[#0f2a1c]" /> ตัวกรองเพิ่มเติม
              </Link>
              <Link href="/?type=บ้านเดี่ยว#properties" className="bg-[#f9f6ef] hover:bg-white text-[#0f2a1c] px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                <Home size={16} className="text-[#d4af37]" /> บ้านเดี่ยว
              </Link>
              <Link href="/?type=คอนโด#properties" className="bg-[#f9f6ef] hover:bg-white text-[#0f2a1c] px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                <Building size={16} className="text-[#d4af37]" /> คอนโด
              </Link>
              <Link href="/?type=ทาวน์โฮม#properties" className="bg-[#f9f6ef] hover:bg-white text-[#0f2a1c] px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                <Home size={16} className="text-[#d4af37]" /> ทาวน์โฮม
              </Link>
              <Link href="/?type=ที่ดิน#properties" className="bg-[#f9f6ef] hover:bg-white text-[#0f2a1c] px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
                <MapPin size={16} className="text-[#d4af37]" /> ที่ดิน
              </Link>
            </div>


          </div>
        </section>

        {/* ─── PROPERTIES SECTION ─── */}
        <section id="properties" className="py-12">
          <div className="container-main">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="text-gold-500 font-bold tracking-widest text-sm uppercase mb-2">
                  All Properties
                </div>
                <h2 className="text-3xl font-extrabold text-[#0a192f]">
                  ทรัพย์ทั้งหมดของเรา
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.length > 0 ? (
                filtered.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500">
                  ไม่พบทรัพย์ที่ตรงกับเงื่อนไขการค้นหา
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── INFO SECTION ─── */}
        <section className="py-16">
          <div className="container-main">
            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Card 1 */}
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <TrendingUp size={140} className="absolute -bottom-8 -right-8 text-forest-50 opacity-60 group-hover:scale-110 transition-transform duration-500" />
                <div className="w-14 h-14 bg-forest-800 rounded-full flex items-center justify-center text-white mb-8 relative z-10 shadow-md">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">วิเคราะห์ราคา</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">ประเมินราคาฟรี<br/>ด้วยข้อมูลจริงในพื้นที่</p>
              </div>
              {/* Card 2 */}
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <Megaphone size={140} className="absolute -bottom-8 -right-8 text-forest-50 opacity-60 group-hover:scale-110 transition-transform duration-500" />
                <div className="w-14 h-14 bg-forest-800 rounded-full flex items-center justify-center text-white mb-8 relative z-10 shadow-md">
                  <Megaphone size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">การตลาดมืออาชีพ</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">โปรโมททรัพย์ตรงกลุ่มเป้าหมาย<br/>ทั้งออนไลน์และออฟไลน์</p>
              </div>
              {/* Card 3 */}
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <Shield size={140} className="absolute -bottom-8 -right-8 text-forest-50 opacity-60 group-hover:scale-110 transition-transform duration-500" />
                <div className="w-14 h-14 bg-forest-800 rounded-full flex items-center justify-center text-white mb-8 relative z-10 shadow-md">
                  <Landmark size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">ดูแลสินเชื่อ</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">แนะนำสินเชื่อที่ดีที่สุด<br/>ให้ฟรี ไม่มีค่าใช้จ่าย</p>
              </div>
              {/* Card 4 */}
              <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <Calendar size={140} className="absolute -bottom-8 -right-8 text-forest-50 opacity-60 group-hover:scale-110 transition-transform duration-500" />
                <div className="w-14 h-14 bg-forest-800 rounded-full flex items-center justify-center text-white mb-8 relative z-10 shadow-md">
                  <Calendar size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">นัดชมทรัพย์</h3>
                <p className="text-sm text-gray-500 leading-relaxed relative z-10">นัดชมง่าย รวดเร็ว<br/>พร้อมดูแลทุกขั้นตอน</p>
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sell Card */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-lg group flex flex-col justify-center p-8 sm:p-10 min-h-[300px]">
                <div className="absolute inset-0 bg-[#163a2c] z-0"></div>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#163a2c] via-[#163a2c]/80 to-transparent z-0"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center shrink-0 shadow-xl border-4 border-white/10">
                    <Home size={40} className="text-forest-800" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 drop-shadow-sm">ฝากขายกับเรา</h3>
                    <p className="text-forest-50/90 text-sm sm:text-base max-w-sm mb-6 leading-relaxed">ให้เราช่วยขายบ้านของคุณได้เร็ว<br/>ในราคาที่คุ้มค่า</p>
                    <Link href="/contact" className="inline-flex items-center gap-3 bg-white text-forest-900 font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-md">
                      ฝากขายกับเรา <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* View Card */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white border border-gray-100 group flex flex-col justify-center p-8 sm:p-10 min-h-[300px]">
                <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-[url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80')] bg-cover bg-center opacity-20 sm:opacity-40 group-hover:scale-105 transition-transform duration-700 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-transparent sm:to-white/10 z-0"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-6">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white border-2 border-forest-50 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                      <Calendar size={36} className="text-forest-800" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">นัดชมทรัพย์</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-5">นัดชมบ้านที่คุณสนใจได้ง่าย ๆ<br/>สะดวก รวดเร็ว</p>
                      <Link href="/contact" className="inline-flex items-center gap-3 bg-[#163a2c] text-white font-bold px-6 py-3 rounded-full hover:bg-forest-900 transition-colors shadow-md">
                        นัดชมทรัพย์ <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                  
                  {/* Features bottom row */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-gray-500 pt-5 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Clock size={16} className="text-forest-700" /> นัดหมายง่าย
                    </div>
                    <div className="w-px h-4 bg-gray-200 hidden sm:block"></div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <MapPin size={16} className="text-forest-700" /> เลือกเวลาได้
                    </div>
                    <div className="w-px h-4 bg-gray-200 hidden sm:block"></div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <CheckCircle2 size={16} className="text-forest-700" /> ปลอดภัย 100%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PORTFOLIO / TRUSTED BY ─── */}
        {portfolioImages.length > 0 && (
          <section className="py-12 bg-warm-50/50">
            <div className="container-main">
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px bg-gray-300 w-12 sm:w-24"></div>
                <div className="text-gray-500 font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase">
                  TRUSTED BY GLOBAL VISIONARIES
                </div>
                <div className="h-px bg-gray-300 w-12 sm:w-24"></div>
              </div>
              <div className="overflow-hidden w-full relative pb-4">
                {/* Fade edges */}
                <div className="absolute top-0 left-0 w-12 sm:w-24 h-full bg-gradient-to-r from-warm-50/50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-12 sm:w-24 h-full bg-gradient-to-l from-warm-50/50 to-transparent z-10 pointer-events-none"></div>
                
                <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                  {[1, 2].map((groupIdx) => (
                    <div key={groupIdx} className="flex gap-6 md:gap-10 pr-6 md:pr-10">
                      {portfolioImages.map((img: string, i: number) => (
                        <div key={`${groupIdx}-${i}`} className="w-48 h-28 md:w-72 md:h-40 lg:w-80 lg:h-48 flex items-center justify-center shrink-0">
                          <img src={img} alt={`portfolio ${i+1}`} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
