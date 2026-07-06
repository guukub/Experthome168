import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'experthome' },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    return NextResponse.json({ success: true, url: (result as any).secure_url })
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload' }, { status: 500 })
  }
}
