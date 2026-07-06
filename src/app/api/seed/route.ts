import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import PropertyModel from '@/models/Property'
import { sampleProperties } from '@/lib/sample-data'
import { generateSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await connectToDatabase()
    
    // Transform sample data
    const docs = sampleProperties.map(p => {
      const { id, ...rest } = p
      return {
        ...rest,
        slug: generateSlug(rest.title) + '-' + Math.random().toString(36).substring(7)
      }
    })
    
    // Check what is in the db
    const current = await PropertyModel.find({})
    
    // If the 6 sample properties are not there, insert them
    if (current.length < 6) {
      await PropertyModel.insertMany(docs)
      return NextResponse.json({ success: true, message: 'Seeded 6 properties' })
    }
    
    return NextResponse.json({ success: true, message: `Already has ${current.length} properties` })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
