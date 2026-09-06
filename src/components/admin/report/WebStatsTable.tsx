import React from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { PropertyMonthlyStat } from '@/types/property'

interface WebStatsTableProps {
  propertyId: string
  monthlyStat: PropertyMonthlyStat | null
  settings?: any
  isSavingImage: boolean
  handleInlineStatChange: (field: string, value: number) => Promise<void>
}

export default function WebStatsTable({ propertyId, monthlyStat, settings, isSavingImage, handleInlineStatChange }: WebStatsTableProps) {
  const totalViews = (monthlyStat?.living_insider_views || 0) + (monthlyStat?.ddproperty_views || 0) + (monthlyStat?.propertyhub_views || 0)
  const totalLeads = (monthlyStat?.living_insider_leads || 0) + (monthlyStat?.ddproperty_leads || 0) + (monthlyStat?.propertyhub_leads || 0)

  return (
    <div className="col-span-5 border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col">
      <div className="bg-forest-800 text-white px-4 py-2 font-bold text-lg flex items-center justify-between">
        <span>ผลการลงประกาศในเว็บไซต์</span>
        {!isSavingImage && (
          <div className="flex items-center gap-2">
            <Link 
              href={`/admin/properties/${propertyId}/history`}
              className="text-sm bg-blue-500/80 hover:bg-blue-500 px-2 py-1 rounded print:hidden flex items-center gap-1 transition-colors"
            >
              <FileText size={14} /> ดูประวัติทั้งหมด
            </Link>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm text-center">
          <thead>
            <tr className="border-b bg-gray-50/50">
              <th className="py-3 font-medium text-gray-600">เว็บไซต์</th>
              <th className="py-3 font-medium text-gray-600">เห็นประกาศ</th>
              <th className="py-3 font-medium text-gray-600">เข้าดูประกาศ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-medium text-blue-600 text-left pl-4 flex items-center gap-2 h-10">
                {settings?.livingInsiderLogoUrl ? (
                  <img src={settings.livingInsiderLogoUrl} alt="LivingInsider" className="h-7 max-w-[120px] object-contain" />
                ) : (
                  <>
                    <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                    LivingInsider
                  </>
                )}
              </td>
              <td className="p-0 border-l print:border-l-gray-300">
                {isSavingImage ? (
                  <div className="w-full h-10 leading-[40px] text-center">{monthlyStat?.living_insider_views || 0}</div>
                ) : (
                  <input 
                    type="number" min="0" value={monthlyStat?.living_insider_views || ''} 
                    onChange={e => handleInlineStatChange('living_insider_views', parseInt(e.target.value) || 0)}
                    className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none print:appearance-none"
                  />
                )}
              </td>
              <td className="p-0 border-l print:border-l-gray-300">
                {isSavingImage ? (
                  <div className="w-full h-10 leading-[40px] text-center">{monthlyStat?.living_insider_leads || 0}</div>
                ) : (
                  <input 
                    type="number" min="0" value={monthlyStat?.living_insider_leads || ''} 
                    onChange={e => handleInlineStatChange('living_insider_leads', parseInt(e.target.value) || 0)}
                    className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none print:appearance-none"
                  />
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-medium text-red-500 text-left pl-4 flex items-center gap-2 h-10">
                {settings?.ddpropertyLogoUrl ? (
                  <img src={settings.ddpropertyLogoUrl} alt="DDproperty" className="h-7 max-w-[120px] object-contain" />
                ) : (
                  <>
                    <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                    DDproperty
                  </>
                )}
              </td>
              <td className="p-0 border-l print:border-l-gray-300">
                {isSavingImage ? (
                  <div className="w-full h-10 leading-[40px] text-center">{monthlyStat?.ddproperty_views || 0}</div>
                ) : (
                  <input 
                    type="number" min="0" value={monthlyStat?.ddproperty_views || ''} 
                    onChange={e => handleInlineStatChange('ddproperty_views', parseInt(e.target.value) || 0)}
                    className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none print:appearance-none"
                  />
                )}
              </td>
              <td className="p-0 border-l print:border-l-gray-300">
                {isSavingImage ? (
                  <div className="w-full h-10 leading-[40px] text-center">{monthlyStat?.ddproperty_leads || 0}</div>
                ) : (
                  <input 
                    type="number" min="0" value={monthlyStat?.ddproperty_leads || ''} 
                    onChange={e => handleInlineStatChange('ddproperty_leads', parseInt(e.target.value) || 0)}
                    className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none print:appearance-none"
                  />
                )}
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-medium text-blue-400 text-left pl-4 flex items-center gap-2 h-10">
                {settings?.propertyhubLogoUrl ? (
                  <img src={settings.propertyhubLogoUrl} alt="PropertyHub" className="h-7 max-w-[120px] object-contain" />
                ) : (
                  <>
                    <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                    propertyhub
                  </>
                )}
              </td>
              <td className="p-0 border-l print:border-l-gray-300">
                {isSavingImage ? (
                  <div className="w-full h-10 leading-[40px] text-center">{monthlyStat?.propertyhub_views || 0}</div>
                ) : (
                  <input 
                    type="number" min="0" value={monthlyStat?.propertyhub_views || ''} 
                    onChange={e => handleInlineStatChange('propertyhub_views', parseInt(e.target.value) || 0)}
                    className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none print:appearance-none"
                  />
                )}
              </td>
              <td className="p-0 border-l print:border-l-gray-300">
                {isSavingImage ? (
                  <div className="w-full h-10 leading-[40px] text-center">{monthlyStat?.propertyhub_leads || 0}</div>
                ) : (
                  <input 
                    type="number" min="0" value={monthlyStat?.propertyhub_leads || ''} 
                    onChange={e => handleInlineStatChange('propertyhub_leads', parseInt(e.target.value) || 0)}
                    className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none print:appearance-none"
                  />
                )}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="bg-forest-50/50 font-bold text-forest-800">
              <td className="py-3 text-right pr-4">รวม</td>
              <td className="py-3 border-l">{totalViews}</td>
              <td className="py-3 border-l">{totalLeads}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
