'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Download, Printer } from 'lucide-react'
import { Property, PropertyLead, PropertyMonthlyStat } from '@/types/property'
import { getPropertyByIdAction, getPropertyLeadsAction, savePropertyLeadAction, deletePropertyLeadAction, getSettingsAction, getMonthlyStatAction, saveMonthlyStatAction, getAllMonthlyStatsAction } from '@/app/actions'
import html2canvas from 'html2canvas'

import ReportHeader from '@/components/admin/report/ReportHeader'
import PropertyInfoSummary from '@/components/admin/report/PropertyInfoSummary'
import LeadsTable from '@/components/admin/report/LeadsTable'
import SalesSummary from '@/components/admin/report/SalesSummary'
import WebStatsTable from '@/components/admin/report/WebStatsTable'
import MarketingChart from '@/components/admin/report/MarketingChart'
import AgentFooter from '@/components/admin/report/AgentFooter'

const MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

export default function PropertyReportPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [leads, setLeads] = useState<PropertyLead[]>([])
  const [settings, setSettings] = useState<any>(null)
  
  // Monthly Stat states
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [monthlyStat, setMonthlyStat] = useState<PropertyMonthlyStat | null>(null)
  const [allMonthlyStats, setAllMonthlyStats] = useState<PropertyMonthlyStat[]>([])

  const [loading, setLoading] = useState(true)
  const [isSavingImage, setIsSavingImage] = useState(false)
  
  const reportRef = useRef<HTMLDivElement>(null)
  
  // Filter leads by selected month and sort by date chronologically
  const currentMonthLeads = leads
    .filter(l => l.contact_date.startsWith(selectedMonth))
    .sort((a, b) => new Date(a.contact_date).getTime() - new Date(b.contact_date).getTime())

  // Stats calculation
  const totalContacts = currentMonthLeads.length
  const interested = currentMonthLeads.filter(l => l.status === 'สนใจ').length
  const followingUp = currentMonthLeads.filter(l => l.status === 'อยู่ระหว่างติดตาม').length
  const notInterested = currentMonthLeads.filter(l => l.status === 'ไม่สนใจ').length
  
  // Real chart data calculation from all monthly stats (last 6 months)
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const monthStr = d.toISOString().slice(0, 7)
    const mStat = allMonthlyStats.find(s => s.month === monthStr)
    return {
      name: `${MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`.slice(0, 8),
      LivingInsider: mStat?.living_insider_views || 0,
      DDproperty: mStat?.ddproperty_views || 0,
      propertyhub: mStat?.propertyhub_views || 0,
    }
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const propData = await getPropertyByIdAction(propertyId)
        if (!propData) {
          router.push('/admin/properties')
          return
        }
        setProperty(propData)
        
        const leadsData = await getPropertyLeadsAction(propertyId)
        setLeads(leadsData)

        const settingsData = await getSettingsAction()
        setSettings(settingsData)

        const statsData = await getAllMonthlyStatsAction(propertyId)
        setAllMonthlyStats(statsData)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [propertyId, router])

  // Fetch monthly stat when selectedMonth changes
  useEffect(() => {
    const loadMonthlyStat = async () => {
      const stat = await getMonthlyStatAction(propertyId, selectedMonth)
      setMonthlyStat(stat)
    }
    loadMonthlyStat()
  }, [propertyId, selectedMonth])

  const handleAddLead = async () => {
    const newLead: Partial<PropertyLead> = {
      property_id: propertyId,
      contact_date: selectedMonth + '-01',
      customer_info: '-',
      interest_level: 3,
      status: 'อยู่ระหว่างติดตาม',
      notes: ''
    }
    await savePropertyLeadAction(newLead)
    // Refresh leads from state by re-adding optimistically
    const tempLead: PropertyLead = {
      id: Date.now().toString(),
      property_id: propertyId,
      contact_date: selectedMonth + '-01',
      customer_info: '-',
      interest_level: 3,
      status: 'อยู่ระหว่างติดตาม',
      notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setLeads([...leads, tempLead])
  }

  const handleLeadChange = async (id: string, field: keyof PropertyLead, value: any) => {
    const updatedLeads = leads.map(l => l.id === id ? { ...l, [field]: value } : l)
    setLeads(updatedLeads)
    const leadToUpdate = updatedLeads.find(l => l.id === id)
    if (leadToUpdate) {
      await savePropertyLeadAction(leadToUpdate)
    }
  }

  const handleDeleteLead = async (id: string) => {
    if (!confirm('ยืนยันการลบลูกค้ารายนี้?')) return
    await deletePropertyLeadAction(id)
    setLeads(leads.filter(l => l.id !== id))
  }

  const handleInlineStatChange = async (field: string, value: number) => {
    if (!monthlyStat) {
      const newStat: Partial<PropertyMonthlyStat> = {
        property_id: propertyId,
        month: selectedMonth,
        [field]: value
      }
      await saveMonthlyStatAction(propertyId, selectedMonth, newStat)
      const refreshed = await getMonthlyStatAction(propertyId, selectedMonth)
      if (refreshed) setMonthlyStat(refreshed)
      return
    }
    
    const updatedStat = { ...monthlyStat, [field]: value }
    setMonthlyStat(updatedStat)
    await saveMonthlyStatAction(propertyId, selectedMonth, updatedStat)
    
    // Refresh all stats for chart
    const refreshedAll = await getAllMonthlyStatsAction(propertyId)
    setAllMonthlyStats(refreshedAll)
  }

  const handleSaveAsImage = async () => {
    if (!reportRef.current) return
    
    try {
      setIsSavingImage(true)
      // wait a bit for React to re-render without inputs
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        logging: false
      })
      
      const image = canvas.toDataURL('image/jpeg', 0.9)
      const link = document.createElement('a')
      link.href = image
      const monthStr = selectedMonth.replace('-', '')
      link.download = `report_${property?.id || 'property'}_${monthStr}.jpg`
      link.click()
    } catch (err) {
      console.error('Error saving image:', err)
      alert('เกิดข้อผิดพลาดในการบันทึกรูปภาพ')
    } finally {
      setIsSavingImage(false)
    }
  }

  if (loading || !property) return <div className="p-8 text-center text-gray-500">กำลังโหลด...</div>

  const [year, month] = selectedMonth.split('-')
  const currentMonthYear = `${MONTHS[parseInt(month) - 1]} ${parseInt(year) + 543}`

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Top Bar - Not printed */}
      <div className="bg-white border-b sticky top-0 z-50 print:hidden">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/properties" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">รายงานผลการทำงาน</h1>
              <p className="text-sm text-gray-500">{property.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <button 
              onClick={handleAddLead}
              className="flex items-center gap-2 bg-forest-600 hover:bg-forest-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
            >
              <Plus size={18} />
              เพิ่มลูกค้าติดต่อ
            </button>

            <button
              onClick={handleSaveAsImage}
              disabled={isSavingImage}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm disabled:opacity-50"
            >
              <Download size={18} />
              {isSavingImage ? 'กำลังบันทึก...' : 'บันทึกเป็นรูปภาพ'}
            </button>

            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
            >
              <Printer size={18} />
              พิมพ์รายงาน
            </button>
          </div>
        </div>
      </div>

      {/* Main Report A4 Container */}
      <div className="max-w-[1200px] mx-auto mt-8 print:mt-0 print:max-w-none">
        <div 
          ref={reportRef} 
          className="bg-white shadow-xl print:shadow-none mx-auto overflow-hidden relative"
          style={{ width: '1200px', minHeight: '1697px' }}
        >
          <ReportHeader 
            property={property}
            settings={settings}
            currentMonthYear={currentMonthYear}
          />
          
          <div className="p-10">
            <PropertyInfoSummary property={property} />
            
            <div className="grid grid-cols-12 gap-6 mb-6">
              <LeadsTable 
                currentMonthLeads={currentMonthLeads}
                isSavingImage={isSavingImage}
                handleLeadChange={handleLeadChange}
                handleDeleteLead={handleDeleteLead}
              />
              <SalesSummary 
                totalContacts={totalContacts}
                interested={interested}
                followingUp={followingUp}
                notInterested={notInterested}
              />
            </div>

            <div className="grid grid-cols-12 gap-6 mb-6">
              <WebStatsTable 
                propertyId={propertyId}
                monthlyStat={monthlyStat}
                settings={settings}
                isSavingImage={isSavingImage}
                handleInlineStatChange={handleInlineStatChange}
              />
              <MarketingChart chartData={chartData} />
            </div>

            <AgentFooter 
              property={property}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
