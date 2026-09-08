'use client'

import React, { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import { Property } from '@/types/property'
import { savePropertyPriceChangesAction } from '@/app/actions'

interface AgentFooterProps {
  property: Property
  settings: any
  isSavingImage?: boolean
}

export default function AgentFooter({ property, settings, isSavingImage = false }: AgentFooterProps) {
  const [priceChanges, setPriceChanges] = useState(() => {
    if (property.price_changes && property.price_changes.length > 0) {
      const existing = property.price_changes.map(pc => ({ date: pc.date || '', price: pc.price || '' }))
      while (existing.length < 3) existing.push({ date: '', price: '' })
      return existing
    }
    return [
      { date: '', price: '' },
      { date: '', price: '' },
      { date: '', price: '' }
    ]
  })

  const handlePriceChange = (index: number, field: 'date' | 'price', value: string) => {
    const newChanges = [...priceChanges]
    newChanges[index][field] = value
    setPriceChanges(newChanges)
  }

  const handleBlur = async () => {
    try {
      if (property?.id) {
        await savePropertyPriceChangesAction(property.id, priceChanges)
      }
    } catch (error) {
      console.error('Failed to auto-save price changes', error)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const parts = dateString.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts
      return `${day}/${month}/${parseInt(year) + 543}`
    }
    return dateString
  }

  return (
    <div className="grid grid-cols-12 gap-6 mt-6">
      {/* Price Changes Table */}
      <div className="col-span-7 border border-gray-200 rounded-xl overflow-hidden bg-white h-fit">
        <table className="w-full text-center text-sm border-collapse">
          <thead>
            <tr>
              <th colSpan={3} className="py-3 border-b border-gray-200 font-bold text-gray-800 text-base">เปลี่ยนแปลงราคาขาย</th>
            </tr>
            <tr className="bg-gray-50/50">
              <th className="py-2 border-b border-r border-gray-200 font-medium text-gray-600 w-[10%]">ลำดับ</th>
              <th className="py-2 border-b border-r border-gray-200 font-medium text-gray-600 w-[30%]">วันที่</th>
              <th className="py-2 border-b border-gray-200 font-medium text-gray-600 w-[60%]">ราคาที่เปลี่ยนแปลง</th>
            </tr>
          </thead>
          <tbody>
            {priceChanges.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 last:border-b-0">
                <td className="py-0 h-10 border-r border-gray-200 text-gray-500 font-medium">{index + 1}</td>
                <td className="py-0 border-r border-gray-200">
                  {isSavingImage ? (
                    <div className="w-full h-full py-3 px-2">{formatDate(row.date)}</div>
                  ) : (
                    <input 
                      type="date" 
                      value={row.date}
                      onChange={(e) => handlePriceChange(index, 'date', e.target.value)}
                      onBlur={handleBlur}
                      className="w-full h-full min-h-[40px] px-2 text-center bg-transparent focus:bg-blue-50 focus:outline-none print:appearance-none"
                    />
                  )}
                </td>
                <td className="py-0">
                  {isSavingImage ? (
                    <div className="w-full h-full py-3 px-2">{row.price}</div>
                  ) : (
                    <input 
                      type="text" 
                      value={row.price}
                      onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                      onBlur={handleBlur}
                      className="w-full h-full min-h-[40px] px-2 text-center bg-transparent focus:bg-blue-50 focus:outline-none print:appearance-none"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="col-start-9 col-span-4 border-2 border-emerald-100 rounded-xl p-4 bg-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-32 h-32">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#065f46" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18.1,88.9,-3.3C87.7,11.5,82.5,25.8,74.5,38C66.5,50.2,55.6,60.3,42.8,68.2C30,76.1,15,81.8,0.3,81.3C-14.4,80.8,-28.7,74.1,-41.8,66.1C-54.9,58.1,-66.6,48.8,-74.6,36.5C-82.6,24.2,-86.8,8.8,-85.4,-6C-84,-20.8,-76.9,-35,-66.8,-46.1C-56.7,-57.2,-43.6,-65.2,-30.2,-72.7C-16.8,-80.2,-3.1,-87.2,10.6,-86.1C24.3,-85,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>
        <div className="flex gap-4 items-center mb-3 relative z-10">
          <div 
            className="w-20 h-20 rounded-full border-2 border-gold-400"
            style={{
              backgroundImage: `url(${property.agent_info?.image_url || settings?.agentProfileUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
          </div>
          <div>
            <div className="font-extrabold text-xl text-forest-800">{property.agent_info?.name || 'ตี๋บางบอน'}</div>
            <div className="text-sm text-gray-600">ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์</div>
          </div>
        </div>
        <div className="space-y-2 text-sm font-bold text-forest-800 relative z-10 ml-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-forest-600 text-white flex items-center justify-center">
              <Phone size={12} strokeWidth={2.5} />
            </span> 
            {property.agent_info?.phone || settings?.phone || '063-159-6536'}
          </div>
          <div className="flex items-center gap-2">
            <span className="h-6 rounded bg-green-500 text-white flex items-center justify-center text-[10px] font-black px-1.5 tracking-wider pt-0.5">
              LINE
            </span> 
            {property.agent_info?.line_id || settings?.lineId || 'Teebanbon'}
          </div>
        </div>
        <div className="mt-4 text-center font-bold text-forest-800 italic relative z-10">
          "พร้อมดูแลทุกขั้นตอน จนกว่าจะได้บ้านที่ใช่"
        </div>
      </div>
    </div>
  )
}
