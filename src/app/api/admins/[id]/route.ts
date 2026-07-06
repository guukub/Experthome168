import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Admin from '@/models/Admin'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'ไม่พบรหัสอ้างอิงผู้ดูแล' }, { status: 400 })
    }

    await connectToDatabase()

    // Prevent deleting the very last admin
    const adminCount = await Admin.countDocuments()
    if (adminCount <= 1) {
      return NextResponse.json({ success: false, error: 'ไม่สามารถลบผู้ดูแลระบบคนสุดท้ายได้' }, { status: 400 })
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id)
    
    if (!deletedAdmin) {
      return NextResponse.json({ success: false, error: 'ไม่พบผู้ดูแลระบบที่ต้องการลบ' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: { id } })
  } catch (error: any) {
    console.error('Error deleting admin:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete admin' }, { status: 500 })
  }
}
