import { Property } from '@/types/property'

declare global {
  var _demoProperties: Property[] | undefined;
}

if (!globalThis._demoProperties) {
  globalThis._demoProperties = [
    {
      id: '1',
      title: 'บ้านเดี่ยว 2 ชั้น หมู่บ้านบางบอนพฤกษา',
      slug: 'บ้านเดี่ยว-บางบอน-พฤกษา-1',
      property_type: 'บ้านเดี่ยว',
      project_name: 'บางบอนพฤกษา',
      location: 'บางบอน',
      address: 'ซอยบางบอน 3 แขวงบางบอน เขตบางบอน กรุงเทพฯ',
      original_price: 3900000,
      price: 3500000,
      status: 'พร้อมขาย',
      land_size: '50 ตร.ว.',
      usable_area: '130 ตร.ม.',
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      description: 'บ้านเดี่ยว 2 ชั้น สวยมาก ทำเลดีเยี่ยม ใกล้ถนนใหญ่และตลาด เหมาะสำหรับครอบครัวที่ต้องการพื้นที่ใช้สอยกว้างขวาง บ้านสภาพดี เจ้าของดูแลรักษาอย่างดี พร้อมเข้าอยู่ได้ทันที ใกล้โรงเรียน ห้างสรรพสินค้า และทางด่วน',
      highlights: ['ลดพิเศษก่อนสิ้นปี', 'ที่จอดรถ 2 คัน', 'ใกล้ทางด่วน', 'โซนเงียบ ปลอดภัย', 'ใกล้ตลาดและห้างสรรพสินค้า'],
      is_featured: true,
      is_visible: true,
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
      ],
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z',
    },
    {
      id: '2',
      title: 'ทาวน์เฮ้าส์ 3 ชั้น โครงการพุทธบูชาวิลล์',
      slug: 'ทาวน์เฮ้าส์-พุทธบูชา-วิลล์-2',
      property_type: 'ทาวน์เฮ้าส์',
      project_name: 'พุทธบูชาวิลล์',
      location: 'พุทธบูชา',
      address: 'ซอยพุทธบูชา 24 แขวงบางมด เขตทุ่งครุ กรุงเทพฯ',
      price: 2200000,
      status: 'พร้อมขาย',
      land_size: '20 ตร.ว.',
      usable_area: '110 ตร.ม.',
      bedrooms: 3,
      bathrooms: 3,
      parking: 1,
      description: 'ทาวน์เฮ้าส์ 3 ชั้น สภาพดี ผ่านการปรับปรุงใหม่ ห้องนอนกว้าง ห้องน้ำครบทุกชั้น ทำเลดีใกล้สถานีรถไฟฟ้า BTS ใกล้ห้างฯ และตลาด เหมาะสำหรับผู้ที่ต้องการบ้านใจกลางเมือง',
      highlights: ['ปรับปรุงใหม่ทั้งหลัง', 'ใกล้ BTS', 'ทำเลศักยภาพ', 'ราคาพิเศษ'],
      is_featured: false,
      is_visible: true,
      images: [
        'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      ],
      created_at: '2024-01-20T08:00:00Z',
      updated_at: '2024-01-20T08:00:00Z',
    },
    {
      id: '3',
      title: 'บ้านเดี่ยว 2 ชั้น โครงการหนองแขม กรีนวิว',
      slug: 'บ้านเดี่ยว-หนองแขม-กรีนวิว-3',
      property_type: 'บ้านเดี่ยว',
      project_name: 'หนองแขม กรีนวิว',
      location: 'หนองแขม',
      address: 'ซอยเพชรเกษม 75 แขวงหนองแขม เขตหนองแขม กรุงเทพฯ',
      price: 4800000,
      status: 'จองแล้ว',
      land_size: '65 ตร.ว.',
      usable_area: '165 ตร.ม.',
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      description: 'บ้านเดี่ยว 2 ชั้น หมู่บ้านปิดสงบ ปลอดภัย ตั้งอยู่ในซอยส่วนตัว มีรั้วรอบขอบชิด สวนรอบบ้านร่มรื่น ห้องใหญ่กว้างขวาง เหมาะสำหรับครอบครัวใหญ่หรือต้องการพื้นที่สีเขียว',
      highlights: ['ที่ดินขนาดใหญ่', 'สวนรอบบ้าน', 'หมู่บ้านปิด', '4 ห้องนอน'],
      is_featured: false,
      is_visible: true,
      images: [
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80',
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
      ],
      created_at: '2024-02-01T08:00:00Z',
      updated_at: '2024-02-10T08:00:00Z',
    },
    {
      id: '4',
      title: 'ที่ดินเปล่า ติดถนนใหญ่ บางบอน',
      slug: 'ที่ดิน-บางบอน-ติดถนน-4',
      property_type: 'ที่ดิน',
      project_name: '',
      location: 'บางบอน',
      address: 'ถนนบางบอน 5 แขวงบางบอน เขตบางบอน กรุงเทพฯ',
      price: 1900000,
      status: 'พร้อมขาย',
      land_size: '100 ตร.ว.',
      usable_area: '-',
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      description: 'ที่ดินเปล่าทำเลดีเยี่ยม ติดถนนใหญ่ ไฟฟ้าน้ำประปาพร้อม เหมาะสำหรับสร้างบ้านหรือพัฒนาเชิงพาณิชย์ ใกล้แหล่งชุมชนและการคมนาคมสะดวก',
      highlights: ['ติดถนนใหญ่', 'ไฟฟ้าน้ำพร้อม', 'โฉนดพร้อมโอน', 'ทำเลดี'],
      is_featured: true,
      is_visible: true,
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
        'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&q=80',
      ],
      created_at: '2024-02-05T08:00:00Z',
      updated_at: '2024-02-05T08:00:00Z',
    },
    {
      id: '5',
      title: 'ทาวน์เฮ้าส์ 2 ชั้น บางแค โครงการเอออน',
      slug: 'ทาวน์เฮ้าส์-บางแค-เอออน-5',
      property_type: 'ทาวน์เฮ้าส์',
      project_name: 'เอออน บางแค',
      location: 'บางแค',
      address: 'ซอยเพชรเกษม 48 แขวงบางแค เขตบางแค กรุงเทพฯ',
      price: 1800000,
      status: 'ขายแล้ว',
      land_size: '18 ตร.ว.',
      usable_area: '90 ตร.ม.',
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      description: 'ทาวน์เฮ้าส์ 2 ชั้น สภาพดี ทำเลใกล้ห้างบิ๊กซีบางแค เดินทางสะดวก ห้องนอน 2 ห้อง เหมาะสำหรับคู่รักหรือครอบครัวเล็ก ราคาดี ขายแล้ว',
      highlights: ['ใกล้บิ๊กซีบางแค', 'ราคาดี', 'สภาพบ้านดี'],
      is_featured: false,
      is_visible: true,
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      ],
      created_at: '2023-11-15T08:00:00Z',
      updated_at: '2024-01-01T08:00:00Z',
    },
    {
      id: '6',
      title: 'บ้านเดี่ยว 2 ชั้น อ้อมน้อย นครปฐม',
      slug: 'บ้านเดี่ยว-อ้อมน้อย-นครปฐม-6',
      property_type: 'บ้านเดี่ยว',
      project_name: 'อ้อมน้อย เพลส',
      location: 'อ้อมน้อย',
      address: 'ซอยเพชรเกษม 116 ตำบลอ้อมน้อย อำเภอกระทุ่มแบน จังหวัดสมุทรสาคร',
      price: 3200000,
      status: 'พร้อมขาย',
      land_size: '55 ตร.ว.',
      usable_area: '140 ตร.ม.',
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      description: 'บ้านเดี่ยว 2 ชั้น สวยงาม ทำเลดีใกล้กรุงเทพฯ ราคาถูกกว่าในเมือง แต่เดินทางสะดวกผ่านถนนเพชรเกษม เหมาะสำหรับผู้ที่ต้องการบ้านขนาดใหญ่ในราคาที่จับต้องได้',
      highlights: ['ราคาดีกว่าในเมือง', 'ใกล้กรุงเทพฯ', 'บ้านสวย', 'ที่ดินขนาดดี'],
      is_featured: true,
      is_visible: true,
      images: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
        'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80',
      ],
      created_at: '2024-03-01T08:00:00Z',
      updated_at: '2024-03-01T08:00:00Z',
    },
  ]
}

export const sampleProperties: Property[] = globalThis._demoProperties

export function getProperties() {
  return globalThis._demoProperties || []
}

export function saveProperty(data: Property, isEdit: boolean) {
  if (isEdit) {
    globalThis._demoProperties = (globalThis._demoProperties || []).map(p => p.id === data.id ? data : p)
  } else {
    data.id = String(Date.now())
    data.created_at = new Date().toISOString()
    globalThis._demoProperties = [...(globalThis._demoProperties || []), data]
  }
}

export function updatePropertyStatus(id: string, status: Property['status']) {
  globalThis._demoProperties = (globalThis._demoProperties || []).map(p => p.id === id ? { ...p, status } : p)
}

export function togglePropertyVisible(id: string) {
  globalThis._demoProperties = (globalThis._demoProperties || []).map(p => p.id === id ? { ...p, is_visible: !p.is_visible } : p)
}

export function togglePropertyFeatured(id: string) {
  globalThis._demoProperties = (globalThis._demoProperties || []).map(p => p.id === id ? { ...p, is_featured: !p.is_featured } : p)
}

export function deleteProperty(id: string) {
  globalThis._demoProperties = (globalThis._demoProperties || []).filter(p => p.id !== id)
}

export const featuredProperties = sampleProperties.filter(p => p.is_featured && p.is_visible)
export const visibleProperties = sampleProperties.filter(p => p.is_visible)
