import React from 'react'
import { Phone } from 'lucide-react'
import { Property } from '@/types/property'

interface ReportHeaderProps {
  property: Property
  settings: any
  currentMonthYear: string
}

export default function ReportHeader({ property, settings, currentMonthYear }: ReportHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b-8 border-forest-800 bg-forest-50/30">
      <div className="flex items-center gap-6 w-1/4">
        {settings?.logoUrl ? (
          <img src={settings.logoUrl} alt="Logo" className="max-w-[120px] max-h-[120px] object-contain" />
        ) : (
          <div className="w-24 h-24 bg-forest-800 rounded-full flex items-center justify-center text-gold-400 font-bold text-xl border-4 border-gold-400">
            LOGO
          </div>
        )}
      </div>
      <div className="flex-1 text-center">
        <h1 className="text-4xl font-extrabold text-forest-800 mb-2 tracking-tight">รายงานผลการขายและการตลาดประจำเดือน</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">{property.title}</h2>
        <div className="inline-block bg-forest-800 text-white px-8 py-2 rounded-full font-bold text-xl shadow-md">
          รายงานประจำเดือน {currentMonthYear}
        </div>
      </div>
      <div className="w-1/4 text-right">
        <div className="text-sm text-gray-600 mb-2">ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์</div>
        <div className="flex items-center justify-end gap-2 text-forest-700 font-bold mb-1.5">
          <span className="w-6 h-6 rounded-full bg-forest-600 text-white flex items-center justify-center">
            <Phone size={12} strokeWidth={2.5} />
          </span>
          {property.agent_info?.phone || settings?.phone || '063-159-6536'}
        </div>
        <div className="flex items-center justify-end gap-2 text-green-600 font-bold">
          <span className="h-6 rounded bg-green-500 text-white flex items-center justify-center text-[10px] font-black px-1.5 tracking-wider pt-0.5">
            LINE
          </span>
          {property.agent_info?.line_id || settings?.lineId || 'Teebanbon'}
        </div>
      </div>
    </div>
  )
}
