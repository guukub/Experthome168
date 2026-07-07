import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import PropertyCard from '@/components/public/PropertyCard'

import { getPropertiesAction } from '@/app/actions'
import { ArrowRight, Search, MapPin, Home, Wallet, ChevronDown, Calendar, Building, Landmark, CheckCircle2, Megaphone, CheckCircle, Shield, Users, TrendingUp } from 'lucide-react'
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
        <section className="relative pt-32 pb-48">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />

          <div className="relative z-10 container-main">
            <div className="max-w-2xl pt-10 pb-16">
              <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-forest-800 leading-tight mb-6">
                บ้านสวย <span className="text-gray-400 font-light">|</span> พร้อมอยู่
                <br />
                คัดคุณภาพ <span className="text-gray-400 font-light">|</span> เพื่อคนหาบ้านจริง
              </h1>

              <p className="text-xl text-gray-700 leading-relaxed mb-10 max-w-xl font-medium">
                เราช่วยคุณค้นหาบ้านที่ใช่ ในทำเลที่ชอบ<br/>
                พร้อมบริการครบ จบทุกขั้นตอน
              </p>

              {/* Features List */}
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Shield className="text-forest-700" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">คัดทรัพย์คุณภาพ</div>
                    <div className="text-sm text-gray-600">ตรวจสอบทุกหลัง</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="text-forest-700" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">โปร่งใส เชื่อถือได้</div>
                    <div className="text-sm text-gray-600">บริการด้วยใจ</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Users className="text-forest-700" size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">ดูแลครบทุกขั้นตอน</div>
                    <div className="text-sm text-gray-600">จนกว่าจะโอนกรรมสิทธิ์</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar - Overlapping bottom */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-4">
            <HeroSearch />
          </div>
        </section>

        <div className="h-24"></div> {/* Spacer for search bar */}

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
        <section className="py-12">
          <div className="container-main">
            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-[#e8ece8] rounded-tl-3xl rounded-tr-sm rounded-bl-sm rounded-br-sm p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-forest-700 rounded-full flex items-center justify-center text-white mb-4">
                  <TrendingUp size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">วิเคราะห์ราคา</h3>
                <p className="text-sm text-gray-600">ประเมินราคาฟรี<br/>ด้วยข้อมูลจริงในพื้นที่</p>
              </div>
              <div className="bg-[#e8ece8] rounded-sm p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-forest-700 rounded-full flex items-center justify-center text-white mb-4">
                  <Megaphone size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">การตลาดมืออาชีพ</h3>
                <p className="text-sm text-gray-600">โปรโมททรัพย์ตรงกลุ่มเป้าหมาย<br/>ทั้งออนไลน์และออฟไลน์</p>
              </div>
              <div className="bg-[#e8ece8] rounded-sm p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-forest-700 rounded-full flex items-center justify-center text-white mb-4">
                  <Landmark size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">ดูแลสินเชื่อ</h3>
                <p className="text-sm text-gray-600">แนะนำสินเชื่อที่ดีที่สุด<br/>ให้ฟรี ไม่มีค่าใช้จ่าย</p>
              </div>
              <div className="bg-[#e8ece8] rounded-tr-3xl rounded-tl-sm rounded-bl-sm rounded-br-sm p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-forest-700 rounded-full flex items-center justify-center text-white mb-4">
                  <Calendar size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">นัดชมทรัพย์</h3>
                <p className="text-sm text-gray-600">นัดชมง่าย รวดเร็ว<br/>พร้อมดูแลทุกขั้นตอน</p>
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-forest-800 rounded-bl-3xl rounded-tl-sm rounded-tr-sm rounded-br-sm p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-forest-700 shrink-0">
                    <Home size={32} />
                  </div>
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-1">ฝากขายกับเรา</h3>
                    <p className="text-forest-100 text-sm">ให้เราช่วยขายบ้านของคุณได้เร็ว ในราคาที่คุ้มค่า</p>
                  </div>
                </div>
                <Link href="/contact" className="hidden sm:flex items-center justify-between gap-4 bg-white text-forest-800 font-bold px-6 py-3 rounded-full hover:bg-forest-50 transition-colors shrink-0">
                  ฝากขายกับเรา <ArrowRight size={18} />
                </Link>
              </div>

              <div className="bg-[#e8ece8] rounded-br-3xl rounded-tl-sm rounded-tr-sm rounded-bl-sm p-8 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-forest-700 shrink-0">
                    <Calendar size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">นัดชมทรัพย์</h3>
                    <p className="text-gray-600 text-sm">นัดชมบ้านที่คุณสนใจได้ง่าย ๆ สะดวก รวดเร็ว</p>
                  </div>
                </div>
                <Link href="/contact" className="hidden sm:flex items-center justify-between gap-4 bg-forest-700 text-white font-bold px-6 py-3 rounded-full hover:bg-forest-800 transition-colors shrink-0">
                  นัดชมทรัพย์ <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
