import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const extension = file.name.split('.').pop()
    const filename = `${uniqueSuffix}.${extension}`
    
    // Ensure the uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (e) {
      // Ignore if exists
    }

    const path = join(uploadsDir, filename)
    await writeFile(path, buffer)

    return NextResponse.json({ success: true, url: `/uploads/${filename}` })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload' }, { status: 500 })
  }
}
