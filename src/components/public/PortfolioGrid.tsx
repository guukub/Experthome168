'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CheckCircle, X, MapPin } from 'lucide-react'

export interface PortfolioGridItem {
  id?: string
  title: string
  location: string
  date: string
  category: string
  imageUrl: string
}

interface PortfolioGridProps {
  items: PortfolioGridItem[]
}

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  const [selectedItem, setSelectedItem] = useState<PortfolioGridItem | null>(null)

  useEffect(() => {
    if (!selectedItem) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedItem(null)
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedItem])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.length > 0 ? items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedItem(item)}
            className="group relative rounded-xl overflow-hidden bg-[#1a232b] border border-white/5 shadow-xl hover:border-gold-500/50 transition-all duration-300 flex flex-col cursor-zoom-in text-left"
            aria-label={`เปิดดูรูปภาพ ${item.title}`}
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a232b] via-transparent to-transparent opacity-60" />
            </div>

            <div className="p-5 flex flex-col flex-grow relative z-10 -mt-2">
              <h3 className="text-white font-bold text-base mb-1.5 flex items-start gap-2">
                <span className="text-gold-500 mt-1 shrink-0"><CheckCircle size={16} /></span>
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
          </button>
        )) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500">
            <Image src="/portfolio_placeholder.png" alt="No data" width={120} height={120} className="opacity-20 grayscale mb-4" />
            <p>ยังไม่มีผลงานในหมวดหมู่นี้</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 p-4 sm:p-8 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={selectedItem.title}
          onClick={() => setSelectedItem(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="ปิดรูปภาพ"
          >
            <X size={24} />
          </button>
          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedItem.imageUrl}
              alt={selectedItem.title}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
