'use client'

import { useState, useEffect } from 'react'
import { Save, Phone, MessageCircle, Facebook, Image as ImageIcon, Upload, X, Home } from 'lucide-react'

export default function SettingsPage() {
  const [form, setForm] = useState({
    phone: '',
    lineId: '',
    lineUrl: '',
    facebook: '',
    facebookUrl: '',
    email: '',
    address: '',
    workingHours: '',
    logoUrl: '',
    heroBgUrl: '',
    portfolioImages: [] as string[],
    propertyTypes: [] as string[]
  })
  const [newPropertyType, setNewPropertyType] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(setForm)
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
      alert('บันทึกข้อมูลติดต่อเรียบร้อยแล้ว')
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setSaving(false)
    }
  }

  const set = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        set('logoUrl', data.url)
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

  const handleHeroBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        set('heroBgUrl', data.url)
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

  const addPropertyType = () => {
    if (newPropertyType.trim() && !form.propertyTypes.includes(newPropertyType.trim())) {
      setForm(f => ({ ...f, propertyTypes: [...f.propertyTypes, newPropertyType.trim()] }))
      setNewPropertyType('')
    }
  }

  const removePropertyType = (typeToRemove: string) => {
    setForm(f => ({ ...f, propertyTypes: f.propertyTypes.filter(t => t !== typeToRemove) }))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ตั้งค่าข้อมูลติดต่อ</h1>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Logo Section */}
          <div className="space-y-4 md:col-span-2 border-b border-gray-100 pb-8">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ImageIcon size={20} className="text-purple-600" />
              โลโก้เว็บไซต์
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {form.logoUrl ? (
                <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center p-2 shrink-0">
                  <img src={form.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400 shrink-0">
                  <ImageIcon size={24} className="mb-1" />
                  <span className="text-xs">No Logo</span>
                </div>
              )}
              <div className="flex-1 space-y-2 w-full">
                <label className="label">อัพโหลดรูปโลโก้ หรือใส่ URL (ถ้าไม่ใส่จะใช้โลโก้เริ่มต้น)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.logoUrl}
                    onChange={e => set('logoUrl', e.target.value)}
                    placeholder="https://..."
                    className="input flex-1"
                  />
                  <label className="btn-secondary whitespace-nowrap cursor-pointer">
                    {uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Background Section */}
          <div className="space-y-4 md:col-span-2 border-b border-gray-100 pb-8">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ImageIcon size={20} className="text-forest-600" />
              รูปภาพปกหน้าแรก (Hero Background)
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {form.heroBgUrl ? (
                <div className="w-40 h-24 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                  <img src={form.heroBgUrl} alt="Hero Bg" className="w-full h-full object-cover rounded-lg" />
                </div>
              ) : (
                <div className="w-40 h-24 bg-gray-50 rounded-xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-gray-400 shrink-0">
                  <ImageIcon size={24} className="mb-1" />
                  <span className="text-xs">No Image</span>
                </div>
              )}
              <div className="flex-1 space-y-2 w-full">
                <label className="label">อัพโหลดรูปภาพพื้นหลัง หรือใส่ URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={form.heroBgUrl}
                    onChange={e => set('heroBgUrl', e.target.value)}
                    placeholder="https://..."
                    className="input flex-1"
                  />
                  <label className="btn-secondary whitespace-nowrap cursor-pointer">
                    {uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดไฟล์'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleHeroBgUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2 border-b border-gray-100 pb-8">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Phone size={20} className="text-forest-600" />
              เบอร์โทรศัพท์
            </h2>
            <div>
              <label className="label">เบอร์โทรศัพท์ที่แสดงบนเว็บ</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="เช่น 081-123-4567"
                className="input"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle size={20} className="text-green-500" />
              LINE
            </h2>
            <div>
              <label className="label">LINE ID (แสดงบนเว็บ)</label>
              <input
                type="text"
                value={form.lineId}
                onChange={e => set('lineId', e.target.value)}
                placeholder="เช่น @teebangbon"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">ลิงก์เพิ่มเพื่อน (URL)</label>
              <input
                type="url"
                value={form.lineUrl}
                onChange={e => set('lineUrl', e.target.value)}
                placeholder="เช่น https://line.me/ti/p/~..."
                className="input"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Facebook size={20} className="text-blue-500" />
              Facebook
            </h2>
            <div>
              <label className="label">ชื่อเพจ (แสดงบนเว็บ)</label>
              <input
                type="text"
                value={form.facebook}
                onChange={e => set('facebook', e.target.value)}
                placeholder="เช่น facebook.com/teebangbon"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">ลิงก์ไปยังเพจ (URL)</label>
              <input
                type="url"
                value={form.facebookUrl}
                onChange={e => set('facebookUrl', e.target.value)}
                placeholder="เช่น https://facebook.com/..."
                className="input"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <MessageCircle size={20} className="text-red-500" />
              ข้อมูลติดต่ออื่นๆ
            </h2>
            <div>
              <label className="label">อีเมล</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="เช่น info@teebangbon.com"
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">ที่อยู่สำนักงาน</label>
              <input
                type="text"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="เช่น บางบอน กรุงเทพมหานคร..."
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">เวลาทำการ</label>
              <input
                type="text"
                value={form.workingHours}
                onChange={e => set('workingHours', e.target.value)}
                placeholder="เช่น เปิดทุกวัน จันทร์–อาทิตย์ 8:00–20:00 น."
                className="input"
                required
              />
            </div>
          </div>

          <div className="space-y-4 md:col-span-2 border-t border-gray-100 pt-8">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Home size={20} className="text-forest-600" />
              ประเภทอสังหาฯ
            </h2>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <label className="label">จัดการประเภทอสังหาฯ (สำหรับใช้ในช่องค้นหาและเพิ่มทรัพย์)</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newPropertyType}
                  onChange={e => setNewPropertyType(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPropertyType() } }}
                  placeholder="เช่น โฮมออฟฟิศ, โรงงาน"
                  className="input flex-1"
                />
                <button type="button" onClick={addPropertyType} className="btn-secondary py-2 px-4 whitespace-nowrap">
                  เพิ่ม
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.propertyTypes && form.propertyTypes.map((type, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm">
                    {type}
                    <button type="button" onClick={() => removePropertyType(type)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {(!form.propertyTypes || form.propertyTypes.length === 0) && (
                  <span className="text-sm text-gray-500 italic">ยังไม่มีประเภทอสังหาฯ</span>
                )}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 px-8 text-lg font-bold flex items-center gap-2"
          >
            <Save size={20} />
            {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
          </button>
        </div>
      </form>
    </div>
  )
}
