'use client'

import { useState, useEffect } from 'react'
import { Save, Image as ImageIcon, Upload, X } from 'lucide-react'

export default function PortfolioPage() {
  const [form, setForm] = useState({
    portfolioImages: [] as string[]
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setForm({ portfolioImages: data.portfolioImages || [] })
      })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/settings', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form) 
      })
      alert('บันทึกผลงานเรียบร้อยแล้ว')
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setSaving(false)
    }
  }

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (res.ok) {
          const data = await res.json()
          return data.url
        }
        return null
      })
      const urls = await Promise.all(uploadPromises)
      const validUrls = urls.filter(Boolean)
      if (validUrls.length > 0) {
        set('portfolioImages', [...(form.portfolioImages || []), ...validUrls])
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัพโหลด')
    } finally {
      setUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const removePortfolioImage = (i: number) => {
    set('portfolioImages', form.portfolioImages.filter((_, idx) => idx !== i))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">จัดการผลงานและความไว้วางใจ</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon size={20} className="text-pink-600" />
            ผลงานของเรา / ความไว้วางใจจากลูกค้า
          </h2>
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-500">
              อัพโหลดรูปลูกค้า โลโก้แบรนด์ หรือผลงานต่างๆ เพื่อนำไปแสดงที่หน้าแรก (ส่วนล่างสุดก่อน Footer)
            </div>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePortfolioUpload}
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
                    <div className="text-sm text-gray-500">รองรับหลายไฟล์พร้อมกัน</div>
                  </>
                )}
              </div>
            </div>

            {form.portfolioImages && form.portfolioImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                {form.portfolioImages.map((img: string, i: number) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center p-2">
                    <img src={img} alt={`portfolio ${i + 1}`} className="max-w-full max-h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => removePortfolioImage(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 px-8 text-lg font-bold flex items-center gap-2"
          >
            <Save size={20} />
            {saving ? 'กำลังบันทึก...' : 'บันทึกผลงาน'}
          </button>
        </div>
      </form>
    </div>
  )
}
