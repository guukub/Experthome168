'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Plus } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import { Property, PropertyMonthlyStat, PropertyLead } from '@/types/property'
import { getPropertyByIdAction, getAllMonthlyStatsAction, saveMonthlyStatAction, getPropertyLeadsAction, savePropertyLeadAction, deletePropertyLeadAction, savePropertyPriceChangesAction } from '@/app/actions'

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

export default function HistoryStatsPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [stats, setStats] = useState<PropertyMonthlyStat[]>([])
  const [leads, setLeads] = useState<PropertyLead[]>([])
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState<string>('')
  const [priceChanges, setPriceChanges] = useState<{ date: string, price: string }[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const propData = await getPropertyByIdAction(propertyId)
        if (!propData) {
          router.push('/admin/properties')
          return
        }
        setProperty(propData)
        if (propData.price_changes) {
          setPriceChanges(propData.price_changes)
        }
        
        const statsData = await getAllMonthlyStatsAction(propertyId)
        setStats(statsData)

        const leadsData = await getPropertyLeadsAction(propertyId)
        leadsData.sort((a, b) => new Date(a.contact_date).getTime() - new Date(b.contact_date).getTime())
        setLeads(leadsData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [propertyId, router])

  const handleStatChange = async (month: string, field: keyof PropertyMonthlyStat, value: number) => {
    // Update local state for immediate UI response
    const updatedStats = [...stats]
    let statIndex = updatedStats.findIndex(s => s.month === month)
    
    if (statIndex === -1) {
      // Create new empty stat object if not exists
      const newStat: PropertyMonthlyStat = {
        property_id: propertyId,
        month: month,
        living_insider_views: 0,
        living_insider_leads: 0,
        ddproperty_views: 0,
        ddproperty_leads: 0,
        propertyhub_views: 0,
        propertyhub_leads: 0,
        [field]: value
      }
      updatedStats.push(newStat)
      // Re-sort descending
      updatedStats.sort((a, b) => b.month.localeCompare(a.month))
    } else {
      updatedStats[statIndex] = { ...updatedStats[statIndex], [field]: value }
    }
    setStats(updatedStats)
    
    // Auto save to DB
    setSavingStatus('กำลังบันทึก...')
    try {
      const statToSave = updatedStats.find(s => s.month === month)
      await saveMonthlyStatAction(propertyId, month, statToSave)
      setSavingStatus('บันทึกสำเร็จ')
      setTimeout(() => setSavingStatus(''), 2000)
    } catch (err) {
      console.error(err)
      setSavingStatus('บันทึกล้มเหลว')
    }
  }

  const handleAddMonth = () => {
    const newMonthStr = window.prompt("กรอกเดือนที่ต้องการเพิ่ม (รูปแบบ YYYY-MM เช่น 2026-09):", new Date().toISOString().slice(0, 7))
    if (!newMonthStr || !/^\d{4}-\d{2}$/.test(newMonthStr)) return
    
    if (stats.some(s => s.month === newMonthStr)) {
      alert("มีข้อมูลเดือนนี้อยู่แล้วในตาราง")
      return
    }

    const newStat: PropertyMonthlyStat = {
      property_id: propertyId,
      month: newMonthStr,
      living_insider_views: 0,
      living_insider_leads: 0,
      ddproperty_views: 0,
      ddproperty_leads: 0,
      propertyhub_views: 0,
      propertyhub_leads: 0
    }
    
    const updatedStats = [...stats, newStat]
    updatedStats.sort((a, b) => b.month.localeCompare(a.month))
    setStats(updatedStats)
  }

  const handleLeadChange = async (leadId: string, field: keyof PropertyLead, value: any) => {
    // Optimistic update
    const updatedLeads = [...leads]
    const leadIndex = updatedLeads.findIndex(l => l.id === leadId)
    if (leadIndex === -1) return

    updatedLeads[leadIndex] = { ...updatedLeads[leadIndex], [field]: value }
    if (field === 'contact_date') {
      updatedLeads.sort((a, b) => new Date(a.contact_date).getTime() - new Date(b.contact_date).getTime())
    }
    setLeads(updatedLeads)

    // Save to DB
    setSavingStatus('กำลังบันทึก...')
    try {
      await savePropertyLeadAction(updatedLeads[leadIndex])
      setSavingStatus('บันทึกสำเร็จ')
      setTimeout(() => setSavingStatus(''), 2000)
    } catch (err) {
      console.error(err)
      setSavingStatus('บันทึกล้มเหลว')
    }
  }

  const handleAddLead = async () => {
    setSavingStatus('กำลังสร้าง...')
    const newLead = {
      property_id: propertyId,
      contact_date: new Date().toISOString().split('T')[0],
      customer_info: '-',
      interest_level: 3,
      status: 'อยู่ระหว่างติดตาม'
    }
    
    try {
      await savePropertyLeadAction(newLead)
      const leadsData = await getPropertyLeadsAction(propertyId)
      leadsData.sort((a, b) => new Date(a.contact_date).getTime() - new Date(b.contact_date).getTime())
      setLeads(leadsData)
      setSavingStatus('บันทึกสำเร็จ')
      setTimeout(() => setSavingStatus(''), 2000)
    } catch (err) {
      console.error(err)
      setSavingStatus('บันทึกล้มเหลว')
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('ยืนยันการลบลูกค้าท่านนี้?')) return
    setSavingStatus('กำลังลบ...')
    try {
      await deletePropertyLeadAction(leadId)
      const leadsData = await getPropertyLeadsAction(propertyId)
      leadsData.sort((a, b) => new Date(a.contact_date).getTime() - new Date(b.contact_date).getTime())
      setLeads(leadsData)
      setSavingStatus('ลบสำเร็จ')
      setTimeout(() => setSavingStatus(''), 2000)
    } catch (err) {
      console.error(err)
      setSavingStatus('ลบล้มเหลว')
    }
  }

  const handlePriceChange = async (index: number, field: 'date' | 'price', value: string) => {
    const updated = [...priceChanges]
    updated[index] = { ...updated[index], [field]: value }
    setPriceChanges(updated)
    
    setSavingStatus('กำลังบันทึก...')
    try {
      await savePropertyPriceChangesAction(propertyId, updated)
      setSavingStatus('บันทึกสำเร็จ')
      setTimeout(() => setSavingStatus(''), 2000)
    } catch (err) {
      console.error(err)
      setSavingStatus('บันทึกล้มเหลว')
    }
  }

  const handleAddPriceChange = async () => {
    const updated = [...priceChanges, { date: new Date().toISOString().split('T')[0], price: '' }]
    setPriceChanges(updated)
    
    setSavingStatus('กำลังสร้าง...')
    try {
      await savePropertyPriceChangesAction(propertyId, updated)
      setSavingStatus('บันทึกสำเร็จ')
      setTimeout(() => setSavingStatus(''), 2000)
    } catch (err) {
      console.error(err)
      setSavingStatus('บันทึกล้มเหลว')
    }
  }

  const handleDeletePriceChange = async (index: number) => {
    if (!confirm('ยืนยันการลบประวัติราคานี้?')) return
    const updated = priceChanges.filter((_, i) => i !== index)
    setPriceChanges(updated)
    
    setSavingStatus('กำลังลบ...')
    try {
      await savePropertyPriceChangesAction(propertyId, updated)
      setSavingStatus('ลบสำเร็จ')
      setTimeout(() => setSavingStatus(''), 2000)
    } catch (err) {
      console.error(err)
      setSavingStatus('ลบล้มเหลว')
    }
  }

  if (loading || !property) {
    return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/properties/${propertyId}/report`} className="text-gray-500 hover:text-gray-900 bg-white px-3 py-2 rounded-lg border shadow-sm flex items-center gap-2">
            <ArrowLeft size={18} /> กลับหน้ารายงาน
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ประวัติสถิติเว็บย้อนหลัง</h1>
            <p className="text-gray-500">{property.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-emerald-600">{savingStatus}</span>
          <button onClick={handleAddMonth} className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 font-bold shadow-sm">
            <Plus size={18} /> เพิ่มเดือนใหม่
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-center">
          <thead>
            <tr>
              <th rowSpan={2} className="border-b border-r bg-gray-100 py-3 px-4 font-bold min-w-[150px]">เดือน</th>
              <th colSpan={2} className="border-b border-r bg-blue-50/50 py-2 font-bold text-blue-800">LivingInsider</th>
              <th colSpan={2} className="border-b border-r bg-red-50/50 py-2 font-bold text-red-800">DDproperty</th>
              <th colSpan={2} className="border-b bg-blue-50/50 py-2 font-bold text-blue-600">PropertyHub</th>
            </tr>
            <tr>
              <th className="border-b border-r bg-gray-50 py-2 font-medium text-gray-600">ยอดวิว</th>
              <th className="border-b border-r bg-gray-50 py-2 font-medium text-gray-600">แชท/สนใจ</th>
              <th className="border-b border-r bg-gray-50 py-2 font-medium text-gray-600">ยอดวิว</th>
              <th className="border-b border-r bg-gray-50 py-2 font-medium text-gray-600">แชท/สนใจ</th>
              <th className="border-b border-r bg-gray-50 py-2 font-medium text-gray-600">ยอดวิว</th>
              <th className="border-b bg-gray-50 py-2 font-medium text-gray-600">แชท/สนใจ</th>
            </tr>
          </thead>
          <tbody>
            {stats.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-gray-500">ยังไม่มีข้อมูลสถิติ กรุณากดปุ่ม "เพิ่มเดือนใหม่"</td>
              </tr>
            ) : stats.map((stat, idx) => {
              const d = new Date(stat.month)
              const monthLabel = `${MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`
              return (
                <tr key={stat.month} className="hover:bg-gray-50 transition-colors">
                  <td className="border-b border-r py-2 px-4 font-bold bg-gray-50/50 text-left">{monthLabel}</td>
                  
                  {/* LivingInsider */}
                  <td className="border-b border-r p-0">
                    <input 
                      type="number" min="0" value={stat.living_insider_views || ''} 
                      onChange={e => handleStatChange(stat.month, 'living_insider_views', parseInt(e.target.value) || 0)}
                      className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="border-b border-r p-0">
                    <input 
                      type="number" min="0" value={stat.living_insider_leads || ''} 
                      onChange={e => handleStatChange(stat.month, 'living_insider_leads', parseInt(e.target.value) || 0)}
                      className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  
                  {/* DDProperty */}
                  <td className="border-b border-r p-0">
                    <input 
                      type="number" min="0" value={stat.ddproperty_views || ''} 
                      onChange={e => handleStatChange(stat.month, 'ddproperty_views', parseInt(e.target.value) || 0)}
                      className="w-full h-full py-3 text-center bg-transparent focus:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-400"
                    />
                  </td>
                  <td className="border-b border-r p-0">
                    <input 
                      type="number" min="0" value={stat.ddproperty_leads || ''} 
                      onChange={e => handleStatChange(stat.month, 'ddproperty_leads', parseInt(e.target.value) || 0)}
                      className="w-full h-full py-3 text-center bg-transparent focus:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-400"
                    />
                  </td>
                  
                  {/* PropertyHub */}
                  <td className="border-b border-r p-0">
                    <input 
                      type="number" min="0" value={stat.propertyhub_views || ''} 
                      onChange={e => handleStatChange(stat.month, 'propertyhub_views', parseInt(e.target.value) || 0)}
                      className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                  <td className="border-b p-0">
                    <input 
                      type="number" min="0" value={stat.propertyhub_leads || ''} 
                      onChange={e => handleStatChange(stat.month, 'propertyhub_leads', parseInt(e.target.value) || 0)}
                      className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-12 mb-4">
        <h2 className="text-xl font-bold text-gray-800">รายละเอียดลูกค้าที่ติดต่อ</h2>
        <button onClick={handleAddLead} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm">
          <Plus size={18} /> เพิ่มลูกค้า
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto mb-8">
        <table className="w-full text-sm text-center">
          <thead>
            <tr>
              <th className="border-b border-r bg-gray-100 py-3 px-4 font-bold w-40">วันที่ติดต่อ</th>
              <th className="border-b border-r bg-gray-100 py-3 px-4 font-bold w-1/4">ชื่อลูกค้า / ช่องทาง</th>
              <th className="border-b border-r bg-gray-100 py-3 px-4 font-bold w-1/4">เบอร์โทรศัพท์</th>
              <th className="border-b border-r bg-gray-100 py-3 px-4 font-bold w-32">ความสนใจ</th>
              <th className="border-b border-r bg-gray-100 py-3 px-4 font-bold w-48">สถานะ</th>
              <th className="border-b border-r bg-gray-100 py-3 px-4 font-bold">หมายเหตุ</th>
              <th className="border-b bg-gray-100 py-3 px-4 font-bold w-16">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-gray-500">ยังไม่มีข้อมูลลูกค้า กรุณากดปุ่ม "เพิ่มลูกค้า"</td>
              </tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="border-b border-r p-0">
                  <input 
                    type="date" value={lead.contact_date} 
                    onChange={e => handleLeadChange(lead.id, 'contact_date', e.target.value)}
                    className="w-full h-full py-3 px-2 text-center bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </td>
                <td className="border-b border-r p-0">
                  <input 
                    type="text" value={lead.customer_info} placeholder="ระบุชื่อลูกค้า"
                    onChange={e => handleLeadChange(lead.id, 'customer_info', e.target.value)}
                    className="w-full h-full py-3 px-3 text-left bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </td>
                <td className="border-b border-r p-0">
                  <input 
                    type="text" value={lead.customer_phone || ''} placeholder="ระบุเบอร์โทรศัพท์"
                    onChange={e => handleLeadChange(lead.id, 'customer_phone', e.target.value)}
                    className="w-full h-full py-3 px-3 text-left bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </td>
                <td className="border-b border-r p-0">
                  <select 
                    value={lead.interest_level}
                    onChange={e => handleLeadChange(lead.id, 'interest_level', parseInt(e.target.value))}
                    className="w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none cursor-pointer"
                  >
                    <option value={1}>⭐ 1</option>
                    <option value={2}>⭐⭐ 2</option>
                    <option value={3}>⭐⭐⭐ 3</option>
                    <option value={4}>⭐⭐⭐⭐ 4</option>
                    <option value={5}>⭐⭐⭐⭐⭐ 5</option>
                  </select>
                </td>
                <td className="border-b border-r p-0">
                  <select 
                    value={lead.status}
                    onChange={e => handleLeadChange(lead.id, 'status', e.target.value)}
                    className={`w-full h-full py-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none font-bold cursor-pointer
                      ${lead.status === 'สนใจ' ? 'text-emerald-600' : ''}
                      ${lead.status === 'อยู่ระหว่างติดตาม' ? 'text-blue-600' : ''}
                      ${lead.status === 'ไม่สนใจ' ? 'text-red-500' : ''}
                    `}
                  >
                    <option value="อยู่ระหว่างติดตาม">อยู่ระหว่างติดตาม</option>
                    <option value="สนใจ">สนใจ</option>
                    <option value="ไม่สนใจ">ไม่สนใจ</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </td>
                <td className="border-b border-r p-0">
                  <input 
                    type="text" value={lead.notes || ''} placeholder="-"
                    onChange={e => handleLeadChange(lead.id, 'notes', e.target.value)}
                    className="w-full h-full py-3 px-3 text-left bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </td>
                <td className="border-b p-0 text-center">
                  <button 
                    onClick={() => handleDeleteLead(lead.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-12 mb-4">
        <h2 className="text-xl font-bold text-gray-800">ประวัติการเปลี่ยนแปลงราคา</h2>
        <button onClick={handleAddPriceChange} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow-sm">
          <Plus size={18} /> เพิ่มประวัติราคา
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto mb-8">
        <table className="w-full text-sm text-center">
          <thead>
            <tr>
              <th className="border-b border-r bg-gray-100 py-3 px-4 font-bold w-1/3">วันที่</th>
              <th className="border-b border-r bg-gray-100 py-3 px-4 font-bold w-1/2">ราคาที่เปลี่ยนแปลง</th>
              <th className="border-b bg-gray-100 py-3 px-4 font-bold w-16">ลบ</th>
            </tr>
          </thead>
          <tbody>
            {priceChanges.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-gray-500">ยังไม่มีประวัติการเปลี่ยนแปลงราคา กรุณากดปุ่ม "เพิ่มประวัติราคา"</td>
              </tr>
            ) : priceChanges.map((pc, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="border-b border-r p-0">
                  <input 
                    type="date" value={pc.date || ''} 
                    onChange={e => handlePriceChange(idx, 'date', e.target.value)}
                    className="w-full h-full py-3 px-2 text-center bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </td>
                <td className="border-b border-r p-0">
                  <input 
                    type="text" value={pc.price || ''} placeholder="ระบุราคา"
                    onChange={e => handlePriceChange(idx, 'price', e.target.value)}
                    className="w-full h-full py-3 px-3 text-center bg-transparent focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </td>
                <td className="border-b p-0 text-center">
                  <button 
                    onClick={() => handleDeletePriceChange(idx)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500 flex items-center gap-2 mb-12">
        <Save size={16} /> ข้อมูลทั้ง 3 ตารางจะถูกบันทึกอัตโนมัติเมื่อมีการเปลี่ยนแปลง
      </div>
    </div>
  )
}
