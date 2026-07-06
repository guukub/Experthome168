'use server'

import { Property as PropertyType } from '@/types/property'
import { revalidatePath } from 'next/cache'
import connectToDatabase from '@/lib/mongodb'
import PropertyModel from '@/models/Property'

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
    await PropertyModel.findByIdAndUpdate(data.id, data, { new: true })
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
    
    // Transform sample data for insertion
    const docs = sampleProperties.map(p => {
      const { id, ...rest } = p
      return rest
    })
    
    await PropertyModel.insertMany(docs)
    properties = await PropertyModel.find({}).sort({ created_at: -1 })
  }
  
  return properties.map(toPlainObject) as PropertyType[]
}
