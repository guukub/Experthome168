import InquiryStats from '@/components/admin/inquiries/InquiryStats'
import InquiryCard, { InquiryData } from '@/components/admin/inquiries/InquiryCard'

// Sample inquiries data
const sampleInquiries: InquiryData[] = [
  {
    id: '1',
    name: 'สมชาย ใจดี',
    phone: '089-123-4567',
    message: 'สนใจบ้านเดี่ยวย่านบางบอน ขอนัดชมได้ไหมครับ',
    property_title: 'บ้านเดี่ยว 2 ชั้น หมู่บ้านบางบอนพฤกษา',
    created_at: '2024-06-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'นางสาว มาลี สวยงาม',
    phone: '081-234-5678',
    message: 'สนใจทาวน์เฮ้าส์พุทธบูชา ราคาพอลดได้ไหมคะ',
    property_title: 'ทาวน์เฮ้าส์ 3 ชั้น โครงการพุทธบูชาวิลล์',
    created_at: '2024-06-14T14:15:00Z',
  },
  {
    id: '3',
    name: 'ประสิทธิ์ ทำดี',
    phone: '092-345-6789',
    message: 'ต้องการฝากขายบ้านย่านบางแค ราคา 2.5 ล้าน ติดต่อด้วยนะครับ',
    property_title: null,
    created_at: '2024-06-13T09:00:00Z',
  },
  {
    id: '4',
    name: 'รัตนา พักผ่อน',
    phone: '083-456-7890',
    message: 'อยากได้บ้านเดี่ยว 3 ห้องนอน ทำเลหนองแขม งบ 4 ล้าน ช่วยหาให้หน่อยนะคะ',
    property_title: null,
    created_at: '2024-06-12T16:45:00Z',
  },
  {
    id: '5',
    name: 'ธนา รวยมาก',
    phone: '086-567-8901',
    message: 'สนใจที่ดินบางบอน ขอดูโฉนดก่อนได้ไหมครับ',
    property_title: 'ที่ดินเปล่า ติดถนนใหญ่ บางบอน',
    created_at: '2024-06-11T11:20:00Z',
  },
]

export default function AdminInquiriesPage() {
  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ข้อความสอบถาม</h1>
          <p className="text-gray-500 mt-0.5">{sampleInquiries.length} รายการ</p>
        </div>
      </div>

      <InquiryStats inquiries={sampleInquiries} />

      <div className="space-y-4">
        {sampleInquiries.map(inquiry => (
          <InquiryCard key={inquiry.id} inquiry={inquiry} />
        ))}
      </div>

      <p className="text-xs text-gray-400 text-center mt-8">
        เมื่อเชื่อมต่อ Supabase แล้ว ข้อความจริงจะแสดงที่นี่แบบ real-time
      </p>
    </div>
  )
}
