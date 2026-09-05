export type PropertyStatus = 'พร้อมขาย' | 'จองแล้ว' | 'ขายแล้ว'
export type PropertyType = string

export interface Property {
  id: string
  title: string
  slug: string
  property_type: PropertyType
  property_code?: string
  project_name?: string
  location: string
  province?: string
  district?: string
  tambon?: string
  postcode?: string
  address?: string
  price: number
  original_price?: number
  rent_price?: number
  status: PropertyStatus
  land_size?: string
  usable_area?: string
  bedrooms?: number
  bathrooms?: number
  parking?: number
  direction?: string
  description?: string
  video_url?: string
  map_url?: string
  highlights?: string[]
  is_featured: boolean
  is_visible: boolean
  images: string[]
  negotiable_price?: number
  appraisal_price?: number
  listing_date?: string
  marketing_stats?: {
    living_insider_views?: number
    living_insider_leads?: number
    ddproperty_views?: number
    ddproperty_leads?: number
    propertyhub_views?: number
    propertyhub_leads?: number
  }
  agent_info?: {
    name?: string
    phone?: string
    line_id?: string
    image_url?: string
  }
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

export interface PropertyLead {
  id: string
  property_id: string
  contact_date: string
  customer_info: string
  customer_phone?: string
  interest_level: number // 1-5
  status: 'อยู่ระหว่างติดตาม' | 'สนใจ' | 'ไม่สนใจ' | 'อื่นๆ'
  notes?: string
  created_at: string
  updated_at: string
}

export interface SearchFilters {
  property_type?: string
  location?: string
  min_price?: number
  max_price?: number
  status?: string
}

export interface PropertyMonthlyStat {
  id?: string
  property_id: string
  month: string
  living_insider_views: number
  living_insider_leads: number
  ddproperty_views: number
  ddproperty_leads: number
  propertyhub_views: number
  propertyhub_leads: number
  created_at?: string
  updated_at?: string
}

