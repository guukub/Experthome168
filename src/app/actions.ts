'use server'

import { Property as PropertyType } from '@/types/property'
import { revalidatePath } from 'next/cache'
import connectToDatabase from '@/lib/mongodb'
import PropertyModel from '@/models/Property'
import PropertyLeadModel from '@/models/PropertyLead'
import PropertyMonthlyStatModel from '@/models/PropertyMonthlyStat'
import { PropertyLead, PropertyMonthlyStat } from '@/types/property'
// Helper to convert Mongoose document to plain plain object for Next.js actions
const toPlainObject = (doc: any) => {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true }) : doc;
  // Convert _id to id if not already done, and stringify ObjectIds
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  // Remove Mongoose internals
  delete obj.__v;
  
  // Recursively stringify dates or objectids
  return JSON.parse(JSON.stringify(obj));
}

export async function savePropertyAction(data: PropertyType, isEdit: boolean) {
  await connectToDatabase()
  
  if (isEdit && data.id) {
    await PropertyModel.findByIdAndUpdate(data.id, data, { returnDocument: 'after' })
  } else {
    // New property
    // Generate a unique slug if not provided, or ensure uniqueness
    let slug = data.slug || `${data.property_type}-${data.location}-${Date.now()}`
    
    // Check if slug exists
    const existing = await PropertyModel.findOne({ slug })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }
    
    const newProperty = new PropertyModel({
      ...data,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    // Remove the temporary id if it was set by the frontend
    if (newProperty.id && newProperty.id.length < 24) {
      newProperty._id = undefined
    }
    
    await newProperty.save()
  }
  
  revalidatePath('/', 'layout')
}

export async function deletePropertyAction(id: string) {
  await connectToDatabase()
  await PropertyModel.findByIdAndDelete(id)
  
  revalidatePath('/', 'layout')
}

export async function updatePropertyStatusAction(id: string, status: PropertyType['status']) {
  await connectToDatabase()
  await PropertyModel.findByIdAndUpdate(id, { status })
  
  revalidatePath('/', 'layout')
}

export async function savePropertyPriceChangesAction(id: string, priceChanges: any[]) {
  await connectToDatabase()
  await PropertyModel.findByIdAndUpdate(id, { price_changes: priceChanges })
  
  revalidatePath('/', 'layout')
}

export async function togglePropertyVisibleAction(id: string) {
  await connectToDatabase()
  const prop = await PropertyModel.findById(id)
  if (prop) {
    prop.is_visible = !prop.is_visible
    await prop.save()
  }
  
  revalidatePath('/', 'layout')
}

export async function togglePropertyFeaturedAction(id: string) {
  await connectToDatabase()
  const prop = await PropertyModel.findById(id)
  if (prop) {
    prop.is_featured = !prop.is_featured
    await prop.save()
  }
  
  revalidatePath('/', 'layout')
}

export async function getPropertiesAction() {
  await connectToDatabase()
  
  let properties = await PropertyModel.find({}).sort({ created_at: -1 })
  
    // Auto-seed if completely empty (first time running)
    if (properties.length === 0) {
      const { sampleProperties } = await import('@/lib/sample-data')
      const { generateSlug } = await import('@/lib/utils')
      
      // Transform sample data for insertion
      const docs = sampleProperties.map(p => {
        const { id, ...rest } = p
        return {
          ...rest,
          slug: generateSlug(rest.title) + '-' + Math.random().toString(36).substring(7)
        }
      })
      
      try {
        await PropertyModel.insertMany(docs)
        properties = await PropertyModel.find({}).sort({ created_at: -1 })
      } catch (e) {
        console.error("Error seeding sample data:", e)
      }
    }
    
    return properties.map(toPlainObject) as PropertyType[]
  }

export async function getPropertyByIdAction(id: string) {
  await connectToDatabase()
  const property = await PropertyModel.findById(id)
  return toPlainObject(property) as PropertyType | null
}

export async function getSettingsAction() {
  await connectToDatabase()
  const { default: Settings } = await import('@/models/Settings')
  try {
    const settings = await Settings.findOne()
    const DEFAULT_SETTINGS = {
      phone: '081-123-4567',
      lineId: '@teebangbon',
      lineUrl: 'https://line.me/ti/p/~@teebangbon',
      facebook: 'facebook.com/teebangbon',
      facebookUrl: 'https://facebook.com/teebangbon',
      tiktok: 'TikTok: teebangbon',
      tiktokUrl: 'https://www.tiktok.com/@teebangbon',
      email: 'info@teebangbon.com',
      portfolioImages: [],
      address: 'บางบอน กรุงเทพมหานคร และพื้นที่ใกล้เคียง (หนองแขม · พุทธบูชา · บางแค · อ้อมน้อย)',
      workingHours: 'เปิดทุกวัน จันทร์–อาทิตย์ 8:00–20:00 น.',
      heroBgUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80',
      propertyTypes: ['บ้านเดี่ยว', 'ทาวน์เฮ้าส์', 'คอนโด', 'ที่ดิน', 'อาคารพาณิชย์']
    }

    if (!settings) {
      return DEFAULT_SETTINGS
    }
    
    const settingsObj = settings.toObject({ virtuals: true })
    const mergedSettings = { ...DEFAULT_SETTINGS, ...settingsObj }
    
    return toPlainObject(mergedSettings)
  } catch (error) {
    console.error('Error in getSettingsAction:', error)
    return null
  }
}

export async function getPropertyLeadsAction(propertyId: string) {
  await connectToDatabase()
  const leads = await PropertyLeadModel.find({ property_id: propertyId }).sort({ contact_date: -1 })
  return leads.map(toPlainObject) as PropertyLead[]
}

export async function savePropertyLeadAction(data: any) {
  await connectToDatabase()
  if (data.id) {
    await PropertyLeadModel.findByIdAndUpdate(data.id, data)
  } else {
    const newLead = new PropertyLeadModel(data)
    await newLead.save()
  }
  revalidatePath('/', 'layout')
}

export async function deletePropertyLeadAction(id: string) {
  await connectToDatabase()
  await PropertyLeadModel.findByIdAndDelete(id)
  revalidatePath('/', 'layout')
}

export async function getMonthlyStatAction(propertyId: string, month: string) {
  await connectToDatabase()
  const stat = await PropertyMonthlyStatModel.findOne({ property_id: propertyId, month })
  return toPlainObject(stat) as PropertyMonthlyStat | null
}

export async function saveMonthlyStatAction(propertyId: string, month: string, data: any) {
  await connectToDatabase()
  const filter = { property_id: propertyId, month }
  const update = { ...data, property_id: propertyId, month }
  
  await PropertyMonthlyStatModel.findOneAndUpdate(filter, update, {
    upsert: true,
    returnDocument: 'after',
    setDefaultsOnInsert: true
  })
  
  revalidatePath('/', 'layout')
}

export async function getAllMonthlyStatsAction(propertyId: string) {
  await connectToDatabase()
  const stats = await PropertyMonthlyStatModel.find({ property_id: propertyId }).sort({ month: -1 })
  return stats.map(toPlainObject) as PropertyMonthlyStat[]
}

