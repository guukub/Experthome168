import InquiryStats from '@/components/admin/inquiries/InquiryStats'
import InquiryCard, { InquiryData } from '@/components/admin/inquiries/InquiryCard'

import connectToDatabase from '@/lib/mongodb'
import { Inquiry } from '@/models/Inquiry'

// Function to fetch inquiries from MongoDB
async function getInquiries(): Promise<InquiryData[]> {
  try {
    await connectToDatabase()
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean()
    
    // Map MongoDB _id and createdAt to match InquiryData interface
    return inquiries.map((doc: any) => ({
      id: doc._id.toString(),
      name: doc.name,
      phone: doc.phone,
      message: doc.message,
      property_title: doc.property_title,
      created_at: doc.createdAt.toISOString()
    }))
  } catch (err) {
    console.error('Error fetching inquiries from MongoDB:', err)
    return []
  }
}

export const dynamic = 'force-dynamic'

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries()

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ข้อความสอบถาม</h1>
          <p className="text-gray-500 mt-0.5">{inquiries.length} รายการ</p>
        </div>
      </div>

      <InquiryStats inquiries={inquiries} />

      <div className="space-y-4">
        {inquiries.map(inquiry => (
          <InquiryCard key={inquiry.id} inquiry={inquiry} />
        ))}
      </div>
    </div>
  )
}
