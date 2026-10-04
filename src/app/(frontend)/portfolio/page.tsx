import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { MapPin, Calendar, Home, CheckCircle, ChevronDown, ArrowRight, Building2, Trees, Settings, Users, ArrowRightCircle, MessageSquare } from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { getPortfoliosAction } from '@/app/portfolioActions';
import PortfolioGrid from '@/components/public/PortfolioGrid';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'แกลลอรีผลงาน | ตี๋บางบอน Experthome168',
  description: 'รวมผลงานการซื้อขาย ฝากขาย อสังหาริมทรัพย์ของ Experthome168 ตี๋บางบอน บ้านเดี่ยว ทาวน์โฮม คอนโด ที่ดิน ดูแลทุกขั้นตอนจนปิดการขาย',
  alternates: {
    canonical: 'https://experthome168.com/portfolio',
  },
  openGraph: {
    title: 'แกลลอรีผลงาน | ตี๋บางบอน Experthome168',
    description: 'รวมผลงานการซื้อขาย ฝากขาย อสังหาริมทรัพย์ของ Experthome168 ตี๋บางบอน บ้านเดี่ยว ทาวน์โฮม คอนโด ที่ดิน ดูแลทุกขั้นตอนจนปิดการขาย',
    url: 'https://experthome168.com/portfolio',
    type: 'website',
    siteName: 'Experthome168',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'แกลลอรีผลงาน | ตี๋บางบอน Experthome168',
    description: 'รวมผลงานการซื้อขาย ฝากขาย อสังหาริมทรัพย์ของ Experthome168 ตี๋บางบอน',
  },
};


const CATEGORIES = [
  { id: 'ทั้งหมด', label: 'ทั้งหมด', icon: <CheckCircle size={16} /> },
  { id: 'บ้านเดี่ยว', label: 'บ้านเดี่ยว', icon: <Home size={16} /> },
  { id: 'ทาวน์โฮม', label: 'ทาวน์โฮม', icon: <Home size={16} /> },
  { id: 'คอนโด', label: 'คอนโด', icon: <Building2 size={16} /> },
  { id: 'ที่ดิน', label: 'ที่ดิน', icon: <Trees size={16} /> },
  { id: 'เช่า/โกดัง', label: 'เช่า/โกดัง', icon: <Building2 size={16} /> },
  { id: 'งานรีโนเวท', label: 'งานรีโนเวท', icon: <Settings size={16} /> },
  { id: 'ลูกค้าของเรา', label: 'ลูกค้าของเรา', icon: <Users size={16} /> },
];

function getCategoryIcon(category: string) {
  const cat = CATEGORIES.find(c => c.id === category);
  return cat ? cat.icon : <CheckCircle size={16} />;
}

export default async function PortfolioPage({ searchParams }: { searchParams: { category?: string } }) {
  const activeCategory = searchParams.category || 'ทั้งหมด';
  
  // Fetch from DB
  const items = await getPortfoliosAction(true);
  
  // Filter
  const displayItems = activeCategory === 'ทั้งหมด' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#0b1319] text-gray-200 font-thai selection:bg-gold-500 selection:text-white">
      <Navbar />

      <div className="pt-[100px] pb-16">
        {/* Header Section */}
        <div className="container-main mx-auto px-4 pt-8 pb-12 text-center">
          <p className="text-gold-500 font-semibold tracking-widest text-sm mb-2 uppercase">Gallery</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            แกลลอรีผลงาน
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-6">
            รวมภาพความสำเร็จจากการดูแลทุกขั้นตอน เพื่อให้คุณได้รับสิ่งที่ดีที่สุด
          </p>
          <div className="flex justify-center">
            <Home className="text-gold-500" size={24} />
          </div>
        </div>

        {/* Filters Section */}
        <div className="container-main mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Tabs */}
            <div className="flex-1 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 w-full md:w-auto scrollbar-hide">
              <div className="flex gap-2 min-w-max">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      href={cat.id === 'ทั้งหมด' ? '/portfolio' : `/portfolio?category=${cat.id}`}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gold-500 text-[#0b1319]'
                          : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <button className="w-full md:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  ล่าสุด
                </div>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="container-main mx-auto px-4 [&>p]:hidden">
          <PortfolioGrid items={displayItems} />
                <p>ยังไม่มีผลงานในหมวดหมู่นี้</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
