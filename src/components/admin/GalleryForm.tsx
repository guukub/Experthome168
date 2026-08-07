'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Image as ImageIcon, Upload, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PortfolioItemData, savePortfolioAction } from '@/app/portfolioActions'

interface GalleryFormProps {
  initialData?: PortfolioItemData
  isEdit?: boolean
}

const CATEGORIES = [
  'บ้านเดี่ยว',
  'ทาวน์โฮม',
  'คอนโด',
  'ที่ดิน',
  'เช่า/โกดัง',
  'งานรีโนเวท',
  'ลูกค้าของเรา'
]

export default function GalleryForm({ initialData, isEdit = false }: GalleryFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<PortfolioItemData>(
    initialData || {
      title: '',
      location: '',
      date: '',
      category: 'บ้านเดี่ยว',
      imageUrl: '',
      is_visible: true
    }
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const set = (key: keyof PortfolioItemData, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        set('imageUrl', data.url)
      } else {
        alert('อัพโหลดรูปล้มเหลว')
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัพโหลด')
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.imageUrl) {
      alert('กรุณาอัพโหลดรูปภาพ')
      return
    }
    
    setSaving(true)
    try {
      await savePortfolioAction(form, isEdit)
      router.push('/admin/gallery')
      router.refresh()
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก')
      setSaving(false)
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto pb-32">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/gallery" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
          <ArrowLeft size={24} className="text-gray-600" />
        </Link>
        <div>
          <div className="text-forest-600 font-bold tracking-widest text-sm uppercase mb-1">
            {isEdit ? 'Edit Gallery' : 'Add New Gallery'}
          </div>
          <h1 className="text-3xl font-extrabold text-[#0a192f]">
            {isEdit ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-forest-100 text-forest-600 flex items-center justify-center">1</span>
            ข้อมูลพื้นฐาน
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">หัวข้อผลงาน (Title)</label>
              <input
                required
                type="text"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                className="input"
                placeholder="เช่น โอนกรรมสิทธิ์บ้านเดี่ยว"
              />
            </div>
            
            <div>
              <label className="label">หมวดหมู่ (Category)</label>
              <select
                required
                value={form.category}
                onChange={e => set('category', e.target.value)}
                className="select"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">สถานที่ (Location)</label>
              <input
                required
                type="text"
                value={form.location}
                onChange={e => set('location', e.target.value)}
                className="input"
                placeholder="เช่น สำนักงานที่ดินกรุงเทพมหานคร"
              />
            </div>

            <div>
              <label className="label">วันที่ (Date)</label>
              <input
                required
                type="text"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="input"
                placeholder="เช่น 15 พ.ค. 2567"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-forest-100 text-forest-600 flex items-center justify-center">2</span>
            รูปภาพผลงาน
          </h2>
          
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={uploading}
            />
            <div className={`flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed rounded-xl transition-colors ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-forest-400'}`}>
              {uploading ? (
                <div className="text-forest-600 font-medium">กำลังอัพโหลด...</div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-forest-600 mb-2">
                    <Upload size={24} />
                  </div>
                  <div className="font-semibold text-gray-700">คลิกเพื่ออัพโหลดรูปภาพ</div>
                  <div className="text-sm text-gray-500">เลือกรูปภาพเพื่อแสดงบนการ์ดผลงาน</div>
                </>
              )}
            </div>
          </div>

          {form.imageUrl && (
            <div className="mt-6">
              <div className="relative group aspect-video max-w-sm rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => set('imageUrl', '')}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">การแสดงผล</h3>
            <p className="text-sm text-gray-500">ซ่อนหรือแสดงผลงานนี้บนหน้าเว็บหลัก</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.is_visible} onChange={e => set('is_visible', e.target.checked)} />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-forest-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-forest-600"></div>
          </label>
        </div>

        {/* Floating Save Bar */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 p-4 px-6 md:px-8 flex justify-end gap-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link href="/admin/gallery" className="btn-secondary">
            ยกเลิก
          </Link>
          <button type="submit" disabled={saving || uploading} className="btn-primary">
            <Save size={20} />
            {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </div>
      </form>
    </div>
  )
}
