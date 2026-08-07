import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Home, CheckCircle, ChevronDown, ArrowRight, Building2, Trees, Settings, Users, ArrowRightCircle, MessageSquare } from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { getPortfoliosAction } from '@/app/portfolioActions';

export const dynamic = 'force-dynamic';

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
        <div className="container-main mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayItems.length > 0 ? (
              displayItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden bg-[#1a232b] border border-white/5 shadow-xl hover:border-gold-500/50 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a232b] via-transparent to-transparent opacity-60"></div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow relative z-10 -mt-2">
                    <h3 className="text-white font-bold text-base mb-1.5 flex items-start gap-2">
                      <span className="text-gold-500 mt-1 shrink-0">{getCategoryIcon(item.category)}</span>
                      <span className="leading-tight">{item.title}</span>
                    </h3>
                    <div className="text-gray-400 text-sm mb-4 flex-grow flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="text-gray-500 text-xs font-medium pt-3 border-t border-white/10 flex justify-between items-center">
                      <span>{item.date}</span>
                      <span className="bg-white/5 px-2 py-1 rounded text-[10px]">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
                <Image src="/portfolio_placeholder.png" alt="No data" width={120} height={120} className="opacity-20 grayscale mb-4" />
                <p>ยังไม่มีผลงานในหมวดหมู่นี้</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
