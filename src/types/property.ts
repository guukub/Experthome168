export type PropertyStatus = 'พร้อมขาย' | 'จองแล้ว' | 'ขายแล้ว'
export type PropertyType = 'บ้านเดี่ยว' | 'ทาวน์เฮ้าส์' | 'คอนโด' | 'ที่ดิน' | 'อาคารพาณิชย์'

export interface Property {
  id: string
  title: string
  slug: string
  property_type: PropertyType
  project_name?: string
  location: string
  province?: string
  district?: string
  tambon?: string
  postcode?: string
  address?: string
  price: number
  original_price?: number
  status: PropertyStatus
  land_size?: string
  usable_area?: string
  bedrooms?: number
  bathrooms?: number
  parking?: number
  description?: string
  video_url?: string
  map_url?: string
  highlights?: string[]
  is_featured: boolean
  is_visible: boolean
  images: string[]
  created_at: string
  updated_at: string
}

export interface Inquiry {
  id: string
  name: string
  phone: string
  message: string
  property_id?: string
  property?: Pick<Property, 'id' | 'title' | 'slug'>
  created_at: string
}

export interface SearchFilters {
  property_type?: string
  location?: string
  min_price?: number
  max_price?: number
  status?: string
}
