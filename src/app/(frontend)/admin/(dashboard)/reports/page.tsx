'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Check, Download, FileText, GripVertical, Search, X } from 'lucide-react'
import html2canvas from 'html2canvas'
import { getReportOverviewAction, saveReportOrderAction, updatePropertyCustomerCodeAction } from '@/app/actions'
import { formatPrice } from '@/lib/utils'

type ReportRow = {
  id: string
  title: string
  property_code?: string
  customer_code?: string
  property_type: string
  images?: string[]
  report_order?: number
  price?: number
  rent_price?: number
  monthlyStat?: {
    living_insider_views?: number
    living_insider_leads?: number
    ddproperty_views?: number
    ddproperty_leads?: number
    propertyhub_views?: number
    propertyhub_leads?: number
  } | null
}

const platforms = [
  { label: 'LivingInsider', views: 'living_insider_views', leads: 'living_insider_leads' },
  { label: 'DDproperty', views: 'ddproperty_views', leads: 'ddproperty_leads' },
  { label: 'PropertyHub', views: 'propertyhub_views', leads: 'propertyhub_leads' },
] as const

function hasPlatformData(row: ReportRow, views: keyof NonNullable<ReportRow['monthlyStat']>, leads: keyof NonNullable<ReportRow['monthlyStat']>) {
  const stat = row.monthlyStat
  return Number(stat?.[views] || 0) > 0 || Number(stat?.[leads] || 0) > 0
}

export default function ReportsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [search, setSearch] = useState('')
  const [rows, setRows] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filtersReady, setFiltersReady] = useState(false)
  const [savingImage, setSavingImage] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const monthParam = params.get('month')
    const searchParam = params.get('search')
    if (monthParam) setMonth(monthParam)
    if (searchParam !== null) setSearch(searchParam)
    setFiltersReady(true)
  }, [])

  useEffect(() => {
    if (!filtersReady) return
    let active = true
    setLoading(true)
    getReportOverviewAction(month).then(data => {
      if (active) setRows(data as ReportRow[])
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [month, filtersReady])

  const searchLower = search.toLowerCase().trim()
  const filteredRows = rows.filter(row =>
    !searchLower ||
    row.title.toLowerCase().includes(searchLower) ||
    (row.property_code || '').toLowerCase().includes(searchLower) ||
    row.property_type.toLowerCase().includes(searchLower)
  )

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return
    const nextRows = [...rows]
    const draggedIndex = nextRows.findIndex(row => row.id === draggedId)
    const targetIndex = nextRows.findIndex(row => row.id === targetId)
    if (draggedIndex < 0 || targetIndex < 0) return
    const [draggedRow] = nextRows.splice(draggedIndex, 1)
    nextRows.splice(targetIndex, 0, draggedRow)
    setRows(nextRows)
    setDraggedId(null)
    await saveReportOrderAction(nextRows.map(row => row.id))
  }

  const handleCustomerCodeChange = (id: string, value: string) => {
    setRows(current => current.map(row => row.id === id ? { ...row, customer_code: value } : row))
  }

  const handleCustomerCodeSave = async (id: string, value: string) => {
    await updatePropertyCustomerCodeAction(id, value)
  }

  const handleSaveAsImage = async () => {
    if (!reportRef.current) return
    setSavingImage(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `property-reports-${month}.jpg`
      link.href = canvas.toDataURL('image/jpeg', 0.92)
      link.click()
    } catch (error) {
      console.error('Failed to save report image', error)
      alert('ไม่สามารถบันทึกรายงานเป็นรูปภาพได้')
    } finally {
      setSavingImage(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-[1500px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="text-forest-600 font-bold tracking-widest text-sm uppercase mb-1">Reports</div>
          <h1 className="text-3xl font-extrabold text-[#0a192f]">รายงานทรัพย์สิน</h1>
          <p className="text-sm text-gray-500 mt-2">แสดงเฉพาะทรัพย์ที่เปิดใช้งานรายงานจากหน้าจัดการทรัพย์</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
            เดือนรายงาน
            <input
              type="month"
              value={month}
              onChange={event => setMonth(event.target.value)}
              className="input w-auto"
            />
          </label>
          <button
            type="button"
            onClick={handleSaveAsImage}
            disabled={savingImage}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0a192f] text-white hover:bg-[#112a4f] disabled:bg-gray-400 text-sm font-semibold"
          >
            <Download size={17} />
            {savingImage ? 'กำลังบันทึก...' : 'บันทึกเป็นรูปภาพ'}
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="ค้นหาชื่อ, รหัสทรัพย์ หรือประเภททรัพย์..."
          className="w-full max-w-md pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 shadow-sm text-sm"
        />
      </div>

      <div ref={reportRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="hidden p-5 border-b border-gray-100">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="ค้นหาชื่อ, รหัสทรัพย์ หรือประเภททรัพย์..."
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="hidden text-left text-xs text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 bg-gray-50/80">
                <th className="px-5 py-4">รูปภาพ</th>
                <th className="px-5 py-4 w-20">ลำดับ</th>
                <th className="px-5 py-4">ชื่อทรัพย์</th>
                <th className="px-5 py-4">รหัสทรัพย์</th>
                <th className="px-5 py-4">ประเภททรัพย์</th>
                <th className="px-5 py-4">ราคาขาย / เช่า</th>
                <th className="px-5 py-4">รูปภาพ</th>
                {platforms.map(platform => <th key={platform.label} className="px-5 py-4 text-center">{platform.label}</th>)}
                <th className="px-5 py-4 text-right">จัดการ</th>
              </tr>
              <tr className="hidden text-left text-xs text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 bg-gray-50/80">
                <th className="px-5 py-4 w-20">ลำดับ</th>
                <th className="px-5 py-4">รูปภาพ</th>
                <th className="px-5 py-4">ชื่อทรัพย์</th>
                <th className="px-5 py-4">รหัสทรัพย์</th>
                <th className="px-5 py-4">ประเภททรัพย์</th>
                <th className="px-5 py-4">ราคาขาย / เช่า</th>
                <th className="px-5 py-4">รหัสลูกค้า</th>
                {platforms.map(platform => <th key={`ordered-${platform.label}`} className="px-5 py-4 text-center">{platform.label}</th>)}
                <th className="px-5 py-4 text-right">จัดการ</th>
              </tr>
              <tr className="text-left text-xs text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100 bg-gray-50/80">
                <th className="px-5 py-4 w-20">ลำดับ</th>
                <th className="px-5 py-4">รูปภาพ</th>
                <th className="px-5 py-4">ชื่อทรัพย์</th>
                <th className="px-5 py-4">รหัสทรัพย์</th>
                <th className="px-5 py-4">รหัสลูกค้า</th>
                <th className="px-5 py-4">ประเภททรัพย์</th>
                <th className="px-5 py-4">ราคาขาย / เช่า</th>
                {platforms.map(platform => <th key={`final-${platform.label}`} className="px-5 py-4 text-center">{platform.label}</th>)}
                <th className="px-5 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={10} className="px-5 py-16 text-center text-gray-400">กำลังโหลดข้อมูล...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={10} className="px-5 py-16 text-center text-gray-400">ยังไม่มีทรัพย์ที่เปิดใช้งานรายงาน</td></tr>
              ) : filteredRows.length === 0 ? (
                <tr><td colSpan={10} className="px-5 py-16 text-center text-gray-400">ไม่พบทรัพย์ที่ค้นหา</td></tr>
              ) : filteredRows.map((row, index) => (
                <tr
                  key={row.id}
                  draggable
                  onDragStart={() => setDraggedId(row.id)}
                  onDragOver={event => event.preventDefault()}
                  onDrop={() => handleDrop(row.id)}
                  onDragEnd={() => setDraggedId(null)}
                  className={`hover:bg-blue-50/30 transition-colors cursor-move ${draggedId === row.id ? 'opacity-50' : ''}`}
                >
                  <td className="px-3 py-4 text-sm font-bold text-gray-500"><span className="inline-flex items-center gap-1"><GripVertical size={14} className="text-gray-400" />{index + 1}</span></td>
                  <td className="px-5 py-4">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                      <img
                        src={row.images?.[0] || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=80'}
                        alt={row.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="w-[220px] max-w-[220px] px-5 py-4 align-middle text-sm font-bold text-[#0a192f]">
                    <div className="w-full line-clamp-2 break-words leading-6" title={row.title}>{row.title}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{row.property_code || '-'}</td>
                  <td className="px-5 py-4">
                    <input
                      type="text"
                      value={row.customer_code || ''}
                      onChange={event => handleCustomerCodeChange(row.id, event.target.value)}
                      onBlur={event => handleCustomerCodeSave(row.id, event.target.value)}
                      onClick={event => event.stopPropagation()}
                      onDragStart={event => event.stopPropagation()}
                      maxLength={6}
                      placeholder="รหัสลูกค้า"
                      className="w-24 px-2 py-2 text-sm text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 bg-white cursor-text"
                    />
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{row.property_type}</td>
                  <td className="px-5 py-4 text-sm whitespace-nowrap">
                    <div className="font-bold text-[#0a192f]">{row.price && row.price > 0 ? formatPrice(row.price) : '-'}</div>
                    <div className="text-forest-700">{row.rent_price && row.rent_price > 0 ? formatPrice(row.rent_price) : '-'}</div>
                  </td>
                  {platforms.map(platform => {
                    const complete = hasPlatformData(row, platform.views, platform.leads)
                    return (
                      <td key={platform.label} className="px-5 py-4 text-center">
                        <span className={`inline-flex w-9 h-9 items-center justify-center rounded-full ${complete ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`} title={complete ? 'กรอกข้อมูลแล้ว' : 'ยังไม่มีข้อมูล'}>
                          {complete ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
                        </span>
                      </td>
                    )
                  })}
                  <td className="px-5 py-4 text-right">
                      <Link href={`/admin/properties/${row.id}/report?month=${month}&returnMonth=${month}&returnSearch=${encodeURIComponent(search)}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 text-sm font-semibold">
                      <FileText size={16} /> เปิดรายงาน
                    </Link>
                    <Link href={`/admin/properties/${row.id}/report?month=${month}&download=1&returnMonth=${month}&returnSearch=${encodeURIComponent(search)}`} className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold">
                      <Download size={16} /> บันทึกรูป
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
