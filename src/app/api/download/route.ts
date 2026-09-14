import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const filename = searchParams.get('filename') || 'document'

  if (!url) {
    return new NextResponse('Missing URL', { status: 400 })
  }

  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    
    // Auto append extension if missing
    let finalName = filename
    if (contentType.includes('pdf') && !finalName.toLowerCase().endsWith('.pdf')) {
      finalName += '.pdf'
    } else if (contentType.includes('image/jpeg') && !finalName.toLowerCase().endsWith('.jpg') && !finalName.toLowerCase().endsWith('.jpeg')) {
      finalName += '.jpg'
    } else if (contentType.includes('image/png') && !finalName.toLowerCase().endsWith('.png')) {
      finalName += '.png'
    }

    // RFC 5987 for non-ASCII (Thai) filename support
    const encodedName = encodeURIComponent(finalName)
    const contentDisposition = `attachment; filename*=UTF-8''${encodedName}`

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      }
    })
  } catch (error) {
    console.error('Proxy download error:', error)
    return new NextResponse('Download failed', { status: 500 })
  }
}
