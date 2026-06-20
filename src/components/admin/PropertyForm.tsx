'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Property } from '@/types/property'
import { PROPERTY_TYPES, PROPERTY_STATUSES, LOCATIONS, generateSlug } from '@/lib/utils'
import { Plus, X, Upload, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PropertyFormProps {
  initialData?: Partial<Property>
  isEdit?: boolean
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  property_type: 'บ้านเดี่ยว' as Property['property_type'],
  project_name: '',
  location: 'บางบอน',
  address: '',
  price: '',
  status: 'พร้อมขาย' as Property['status'],
  land_size: '',
  usable_area: '',
  bedrooms: '',
  bathrooms: '',
  parking: '',
  description: '',
  highlights: [] as string[],
  is_featured: false,
  is_visible: true,
  images: [] as string[],
}

export default function PropertyForm({ initialData, isEdit = false }: PropertyFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...initialData,
    price: initialData?.price?.toString() || '',
    bedrooms: initialData?.bedrooms?.toString() || '',
    bathrooms: initialData?.bathrooms?.toString() || '',
    parking: initialData?.parking?.toString() || '',
    highlights: initialData?.highlights || [],
    images: initialData?.images || [],
  })
  const [newHighlight, setNewHighlight] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handleTitleChange = (title: string) => {
    set('title', title)
    if (!isEdit) set('slug', generateSlug(title))
  }

  const addHighlight = () => {
    if (newHighlight.trim()) {
      set('highlights', [...form.highlights, newHighlight.trim()])
      setNewHighlight('')
    }
  }

  const removeHighlight = (i: number) => {
    set('highlights', form.highlights.filter((_: string, idx: number) => idx !== i))
  }

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      set('images', [...form.images, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const removeImage = (i: number) => {
    set('images', form.images.filter((_: string, idx: number) => idx !== i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Use server action to save demo data
    try {
      await import('@/app/actions').then(m => m.savePropertyAction(form as Property, isEdit))
    } catch (e) {
      console.error(e)
    }

    await new Promise(r => setTimeout(r, 800)) // Simulate save
    setSaved(true)
    setSaving(false)
    setTimeout(() => {
      router.push('/admin/properties')
    }, 1000)
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/properties" className="btn-ghost -ml-2 text-gray-600">
          <ArrowLeft size={18} /> กลับ
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'แก้ไขทรัพย์' : 'เพิ่มทรัพย์ใหม่'}
          </h1>
          <p className="text-gray-500 text-sm">กรอกข้อมูลทรัพย์ที่ต้องการ{isEdit ? 'แก้ไข' : 'ลงประกาศ'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-5 text-lg">ข้อมูลพื้นฐาน</h2>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="prop-title">ชื่อทรัพย์ *</label>
              <input
                id="prop-title"
                type="text"
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                required
                placeholder="เช่น บ้านเดี่ยว 2 ชั้น หมู่บ้านบางบอน"
                className="input"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="prop-slug">Slug (URL)</label>
                <input
                  id="prop-slug"
                  type="text"
                  value={form.slug}
                  onChange={e => set('slug', e.target.value)}
                  placeholder="ชื่อ-slug-ของทรัพย์"
                  className="input font-mono text-sm"
                />
              </div>
              <div>
                <label className="label" htmlFor="prop-project">ชื่อโครงการ</label>
                <input
                  id="prop-project"
                  type="text"
                  value={form.project_name}
                  onChange={e => set('project_name', e.target.value)}
                  placeholder="เช่น บางบอนพฤกษา"
                  className="input"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="prop-type">ประเภทอสังหาฯ *</label>
                <select id="prop-type" value={form.property_type} onChange={e => set('property_type', e.target.value)} className="select" required>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="prop-status">สถานะ *</label>
                <select
                  id="prop-status"
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                  className={`select font-semibold ${
                    form.status === 'พร้อมขาย' ? 'text-emerald-700' :
                    form.status === 'จองแล้ว' ? 'text-amber-600' : 'text-red-600'
                  }`}
                  required
                >
                  {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Price */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-5 text-lg">ทำเลและราคา</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="prop-location">ทำเล *</label>
                <select id="prop-location" value={form.location} onChange={e => set('location', e.target.value)} className="select" required>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="prop-price">ราคาขาย (บาท) *</label>
                <input
                  id="prop-price"
                  type="number"
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  required
                  placeholder="3500000"
                  className="input"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="prop-address">ที่อยู่เต็ม</label>
              <input
                id="prop-address"
                type="text"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="ซอย ถนน แขวง เขต จังหวัด"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-5 text-lg">รายละเอียดทรัพย์</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="label" htmlFor="prop-land">ขนาดที่ดิน</label>
              <input id="prop-land" type="text" value={form.land_size} onChange={e => set('land_size', e.target.value)} placeholder="เช่น 50 ตร.ว." className="input" />
            </div>
            <div>
              <label className="label" htmlFor="prop-area">พื้นที่ใช้สอย</label>
              <input id="prop-area" type="text" value={form.usable_area} onChange={e => set('usable_area', e.target.value)} placeholder="เช่น 130 ตร.ม." className="input" />
            </div>
            <div>
              <label className="label" htmlFor="prop-bed">ห้องนอน</label>
              <input id="prop-bed" type="number" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} placeholder="3" className="input" min="0" />
            </div>
            <div>
              <label className="label" htmlFor="prop-bath">ห้องน้ำ</label>
              <input id="prop-bath" type="number" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} placeholder="2" className="input" min="0" />
            </div>
            <div>
              <label className="label" htmlFor="prop-park">ที่จอดรถ</label>
              <input id="prop-park" type="number" value={form.parking} onChange={e => set('parking', e.target.value)} placeholder="2" className="input" min="0" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-5 text-lg">รายละเอียดเพิ่มเติม</h2>
          <div>
            <label className="label" htmlFor="prop-desc">คำอธิบาย</label>
            <textarea
              id="prop-desc"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={5}
              placeholder="บรรยายทรัพย์ จุดเด่น ทำเล สิ่งอำนวยความสะดวกใกล้เคียง..."
              className="input resize-none"
            />
          </div>

          {/* Highlights */}
          <div className="mt-4">
            <label className="label">จุดเด่น</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newHighlight}
                onChange={e => setNewHighlight(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHighlight() } }}
                placeholder="เพิ่มจุดเด่น เช่น ใกล้ทางด่วน"
                className="input flex-1"
              />
              <button type="button" onClick={addHighlight} className="btn-secondary py-2 px-4 shrink-0">
                <Plus size={16} /> เพิ่ม
              </button>
            </div>
            {form.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.highlights.map((h: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-forest-50 text-forest-700 border border-forest-100 rounded-xl text-sm font-medium">
                    {h}
                    <button type="button" onClick={() => removeHighlight(i)} className="text-forest-400 hover:text-red-500 transition-colors ml-1">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-5 text-lg">รูปภาพ</h2>
          <p className="text-sm text-gray-500 mb-4">ใส่ URL รูปภาพ (Supabase Storage หรือ URL อื่นๆ)</p>

          <div className="flex gap-2 mb-4">
            <input
              type="url"
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addImageUrl() } }}
              placeholder="https://..."
              className="input flex-1"
            />
            <button type="button" onClick={addImageUrl} className="btn-secondary py-2 px-4 shrink-0">
              <Upload size={16} /> เพิ่ม
            </button>
          </div>

          {form.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {form.images.map((img: string, i: number) => (
                <div key={i} className="relative group aspect-video rounded-xl overflow-hidden bg-gray-100">
                  <img src={img} alt={`img ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                  {i === 0 && (
                    <div className="absolute bottom-1.5 left-1.5 bg-forest-600 text-white text-xs px-2 py-0.5 rounded-md">
                      หลัก
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-5 text-lg">การตั้งค่า</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.is_visible}
                onChange={e => set('is_visible', e.target.checked)}
                className="w-5 h-5 rounded accent-forest-600"
              />
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-forest-700 transition-colors">แสดงในหน้าเว็บ</div>
                <div className="text-sm text-gray-500">ผู้เยี่ยมชมสามารถเห็นทรัพย์นี้ได้</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={e => set('is_featured', e.target.checked)}
                className="w-5 h-5 rounded accent-gold-500"
              />
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-gold-600 transition-colors">ตั้งเป็นทรัพย์แนะนำ</div>
                <div className="text-sm text-gray-500">ทรัพย์นี้จะแสดงในหน้าแรกของเว็บไซต์</div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving || saved}
            className="btn-primary px-8 py-3.5 text-base disabled:opacity-60"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                </svg>
                กำลังบันทึก...
              </span>
            ) : saved ? (
              <span className="flex items-center gap-2">✓ บันทึกแล้ว</span>
            ) : (
              <span className="flex items-center gap-2"><Save size={18} /> {isEdit ? 'บันทึกการแก้ไข' : 'บันทึกทรัพย์'}</span>
            )}
          </button>
          <Link href="/admin/properties" className="btn-ghost text-gray-600">
            ยกเลิก
          </Link>
        </div>
      </form>
    </div>
  )
}
