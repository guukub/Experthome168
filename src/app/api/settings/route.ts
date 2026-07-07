import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Settings from '@/models/Settings'

const DEFAULT_SETTINGS = {
  phone: '081-123-4567',
  lineId: '@teebangbon',
  lineUrl: 'https://line.me/ti/p/~@teebangbon',
  facebook: 'facebook.com/teebangbon',
  facebookUrl: 'https://facebook.com/teebangbon',
  email: 'info@teebangbon.com',
  address: 'บางบอน กรุงเทพมหานคร และพื้นที่ใกล้เคียง (หนองแขม · พุทธบูชา · บางแค · อ้อมน้อย)',
  workingHours: 'เปิดทุกวัน จันทร์–อาทิตย์ 8:00–20:00 น.'
}

export async function GET() {
  try {
    await connectToDatabase()
    const settings = await Settings.findOne()
    if (!settings) {
      return NextResponse.json(DEFAULT_SETTINGS)
    }
    return NextResponse.json(settings)
  } catch (e) {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    let settings = await Settings.findOne()
    if (!settings) {
      settings = new Settings(body)
    } else {
      Object.assign(settings, body)
    }
    await settings.save()
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
