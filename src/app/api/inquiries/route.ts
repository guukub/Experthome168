import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Inquiry } from '@/models/Inquiry'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, subject, message, property_title } = body

    if (!name || !phone) {
      return NextResponse.json({ error: 'กรุณากรอกชื่อและเบอร์โทร' }, { status: 400 })
    }

    await connectToDatabase()

    const combinedMessage = `${subject ? `[${subject}] ` : ''}${message || ''}`

    const newInquiry = await Inquiry.create({
      name,
      phone,
      message: combinedMessage,
      property_title: property_title || null,
    })

    return NextResponse.json({ success: true, message: 'รับข้อความเรียบร้อยแล้ว' })
  } catch (error) {
    console.error('Error saving inquiry:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' }, { status: 500 })
  }
}

export async function GET() {
  // Admin only - list all inquiries
  // In production: check auth session first
  return NextResponse.json({ message: 'Admin access required' }, { status: 401 })
}
