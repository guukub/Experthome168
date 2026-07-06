import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'zvm2hdmd'
    const apiKey = process.env.CLOUDINARY_API_KEY || '388417448313342'
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'sN3p7GQC9SzZv1rOqBf59DERW-U'

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: 'Missing Cloudinary configuration' }, { status: 500 })
    }

    const data = await request.formData()
    const file = data.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
    }

    // Convert file to Base64 for safe and reliable transmission
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = `data:${file.type};base64,${buffer.toString('base64')}`

    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = 'experthome'
    
    // Generate Cloudinary signature
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto.createHash('sha1').update(signatureString).digest('hex')

    const formData = new FormData()
    formData.append('file', base64Data)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp.toString())
    formData.append('signature', signature)
    formData.append('folder', folder)

    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    const result = await uploadResponse.json()

    if (!uploadResponse.ok) {
      console.error('Cloudinary API Error:', result)
      return NextResponse.json({ success: false, error: result.error?.message || 'Cloudinary error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, url: result.secure_url })
  } catch (error: any) {
    console.error('Server Upload Error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Server upload failed' }, { status: 500 })
  }
}
