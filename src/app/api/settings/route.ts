import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'

const DEFAULT_SETTINGS = {
  phone: '081-123-4567',
  lineId: '@teebangbon',
  lineUrl: 'https://line.me/ti/p/~@teebangbon',
  facebook: 'facebook.com/teebangbon',
  facebookUrl: 'https://facebook.com/teebangbon'
}

export async function GET() {
  const path = join(process.cwd(), 'src', 'lib', 'settings.json')
  try {
    const data = await fs.readFile(path, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (e) {
    return NextResponse.json(DEFAULT_SETTINGS)
  }
}

export async function POST(req: Request) {
  const path = join(process.cwd(), 'src', 'lib', 'settings.json')
  const body = await req.json()
  await fs.writeFile(path, JSON.stringify(body, null, 2))
  return NextResponse.json({ success: true })
}
