import React from 'react'
import { CheckCircle, Clock, XCircle, FileText } from 'lucide-react'

interface SalesSummaryProps {
  totalContacts: number
  interested: number
  followingUp: number
  notInterested: number
}

export default function SalesSummary({ totalContacts, interested, followingUp, notInterested }: SalesSummaryProps) {
  return (
    <div className="col-span-4 border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="bg-forest-800 text-white px-4 py-2 font-bold text-lg text-center">
        สรุปผลการขายประจำเดือน
      </div>
      <div className="p-4 grid grid-cols-2 gap-3 h-[calc(100%-44px)] content-center">
        <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-forest-700 bg-forest-50 p-1.5 rounded-lg"><CheckCircle size={20} /></span>
            <span className="text-xs text-gray-500 font-bold">ลูกค้าที่ติดต่อ</span>
          </div>
          <div className="text-3xl font-extrabold text-forest-800">{totalContacts}</div>
          <div className="text-xs text-gray-400">ราย</div>
        </div>
        <div className="border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-700 bg-blue-50 p-1.5 rounded-lg"><Clock size={20} /></span>
            <span className="text-xs text-gray-500 font-bold leading-tight">อยู่ระหว่างติดตาม</span>
          </div>
          <div className="text-3xl font-extrabold text-forest-800">{followingUp}</div>
          <div className="text-xs text-gray-400">ราย</div>
        </div>
        <div className="border border-gray-200 rounded-xl p-3 flex items-center justify-between col-span-2 px-6 bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1 text-emerald-600"><CheckCircle size={16} /> <span className="text-xs font-bold">สนใจ</span></div>
            <div className="text-xl font-bold text-emerald-700">{interested} <span className="text-xs text-gray-400 font-normal">ราย</span></div>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1 text-red-500"><XCircle size={16} /> <span className="text-xs font-bold">ไม่สนใจ</span></div>
            <div className="text-xl font-bold text-red-600">{notInterested} <span className="text-xs text-gray-400 font-normal">ราย</span></div>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1 text-amber-600"><FileText size={16} /> <span className="text-xs font-bold">หมายเหตุ</span></div>
            <div className="text-xl font-bold text-amber-700">0 <span className="text-xs text-gray-400 font-normal">รายการ</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
