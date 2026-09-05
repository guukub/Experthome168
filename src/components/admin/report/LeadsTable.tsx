import React from 'react'
import { Trash2 } from 'lucide-react'
import { PropertyLead } from '@/types/property'

interface LeadsTableProps {
  currentMonthLeads: PropertyLead[]
  isSavingImage: boolean
  handleLeadChange: (id: string, field: keyof PropertyLead, value: any) => Promise<void>
  handleDeleteLead: (id: string) => Promise<void>
}

export default function LeadsTable({ currentMonthLeads, isSavingImage, handleLeadChange, handleDeleteLead }: LeadsTableProps) {
  return (
    <div className="col-span-8 border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="bg-forest-800 text-white px-4 py-2 font-bold text-lg">
        รายละเอียดลูกค้าที่ติดต่อ
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-forest-700 text-white text-center">
            <th className="py-2 border-r border-forest-600 font-medium">ลำดับ</th>
            <th className="py-2 border-r border-forest-600 font-medium">วันที่ติดต่อ</th>
            <th className="py-2 border-r border-forest-600 font-medium w-1/3">ชื่อลูกค้า / ช่องทาง</th>
            <th className="py-2 border-r border-forest-600 font-medium">ความสนใจ</th>
            <th className="py-2 border-r border-forest-600 font-medium">สถานะ</th>
            <th className="py-2 font-medium">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(Math.max(5, currentMonthLeads.length))].map((_, idx) => {
            const lead = currentMonthLeads[idx]
            return (
              <tr key={lead ? lead.id : `empty-${idx}`} className="border-b text-center hover:bg-gray-50 group">
                <td className="py-2.5 border-r relative print:border-r-gray-300">
                  {idx + 1}
                  {lead && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 hidden group-hover:flex gap-1 print:hidden">
                      <button onClick={() => handleDeleteLead(lead.id)} className="text-red-500 bg-white rounded p-0.5 shadow-sm">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-0 border-r print:border-r-gray-300 h-10">
                  {lead ? (
                    isSavingImage ? (
                      <div className="w-full h-10 leading-[40px] px-1 text-center text-sm">{lead.contact_date}</div>
                    ) : (
                      <input 
                        type="date" value={lead.contact_date} 
                        onChange={e => handleLeadChange(lead.id, 'contact_date', e.target.value)}
                        className="w-full h-full py-2.5 px-1 text-center bg-transparent focus:bg-blue-50 focus:outline-none print:appearance-none"
                      />
                    )
                  ) : ''}
                </td>
                <td className="py-0 border-r print:border-r-gray-300 h-10">
                  {lead ? (
                    isSavingImage ? (
                      <div className="w-full h-10 leading-[40px] px-2 text-left text-sm truncate">{lead.customer_info}</div>
                    ) : (
                      <input 
                        type="text" value={lead.customer_info} placeholder="ชื่อ หรือเบอร์โทร"
                        onChange={e => handleLeadChange(lead.id, 'customer_info', e.target.value)}
                        className="w-full h-full py-2.5 px-2 text-left bg-transparent focus:bg-blue-50 focus:outline-none placeholder:text-gray-300"
                      />
                    )
                  ) : ''}
                </td>
                <td className="py-0 border-r print:border-r-gray-300 h-10 align-middle">
                  {lead ? (
                    isSavingImage ? (
                      <div className="w-full h-10 leading-[40px] text-center text-gold-500 font-bold text-sm tracking-widest">{Array(lead.interest_level).fill('⭐').join('')}</div>
                    ) : (
                      <select 
                        value={lead.interest_level}
                        onChange={e => handleLeadChange(lead.id, 'interest_level', parseInt(e.target.value))}
                        className="w-full h-full text-center bg-transparent focus:bg-blue-50 focus:outline-none cursor-pointer appearance-none print:appearance-none text-gold-500 font-bold tracking-widest"
                      >
                        <option value={1}>⭐</option>
                        <option value={2}>⭐⭐</option>
                        <option value={3}>⭐⭐⭐</option>
                        <option value={4}>⭐⭐⭐⭐</option>
                        <option value={5}>⭐⭐⭐⭐⭐</option>
                      </select>
                    )
                  ) : ''}
                </td>
                <td className="py-0 border-r print:border-r-gray-300 h-10">
                  {lead ? (
                    isSavingImage ? (
                      <div className={`w-full h-10 leading-[40px] text-center font-bold text-sm
                        ${lead.status === 'สนใจ' ? 'text-emerald-600' : ''}
                        ${lead.status === 'อยู่ระหว่างติดตาม' ? 'text-blue-600' : ''}
                        ${lead.status === 'ไม่สนใจ' ? 'text-red-500' : ''}
                      `}>{lead.status === 'อยู่ระหว่างติดตาม' ? 'ติดตาม' : lead.status}</div>
                    ) : (
                      <select 
                        value={lead.status}
                        onChange={e => handleLeadChange(lead.id, 'status', e.target.value)}
                        className={`w-full h-full py-2.5 text-center bg-transparent focus:bg-blue-50 focus:outline-none cursor-pointer appearance-none print:appearance-none font-bold
                          ${lead.status === 'สนใจ' ? 'text-emerald-600' : ''}
                          ${lead.status === 'อยู่ระหว่างติดตาม' ? 'text-blue-600' : ''}
                          ${lead.status === 'ไม่สนใจ' ? 'text-red-500' : ''}
                        `}
                      >
                        <option value="อยู่ระหว่างติดตาม">ติดตาม</option>
                        <option value="สนใจ">สนใจ</option>
                        <option value="ไม่สนใจ">ไม่สนใจ</option>
                        <option value="อื่นๆ">อื่นๆ</option>
                      </select>
                    )
                  ) : ''}
                </td>
                <td className="py-0 h-10">
                  {lead ? (
                    isSavingImage ? (
                      <div className="w-full h-10 leading-[40px] px-2 text-center text-xs text-gray-700 truncate">{lead.notes || '-'}</div>
                    ) : (
                      <input 
                        type="text" value={lead.notes || ''} placeholder="-"
                        onChange={e => handleLeadChange(lead.id, 'notes', e.target.value)}
                        className="w-full h-full py-2.5 px-2 text-center bg-transparent focus:bg-blue-50 focus:outline-none placeholder:text-gray-300 text-xs"
                      />
                    )
                  ) : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
