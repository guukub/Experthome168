// API route for submitting inquiries
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, message, property_id } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและเบอร์โทร' }, { status: 400 })
    }

    // In production: save to Supabase
    // const supabase = createAdminClient()
    // await supabase.from('inquiries').insert({ name, phone, message, property_id })

    // For now, just return success
    return NextResponse.json({ success: true, message: 'รับข้อความเรียบร้อยแล้ว' })
  } catch (error) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, { status: 500 })
  }
}

export async function GET() {
  // Admin only - list all inquiries
  // In production: check auth session first
  return NextResponse.json({ message: 'Admin access required' }, { status: 401 })
}
