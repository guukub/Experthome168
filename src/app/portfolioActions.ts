'use server'

import { revalidatePath } from 'next/cache'
import connectToDatabase from '@/lib/mongodb'
import PortfolioModel from '@/models/Portfolio'

// Helper to convert Mongoose document to plain object
const toPlainObject = (doc: any) => {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject({ virtuals: true }) : doc;
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  delete obj.__v;
  return JSON.parse(JSON.stringify(obj));
}

export type PortfolioItemData = {
  id?: string
  title: string
  location: string
  date: string
  category: string
  imageUrl: string
  is_visible?: boolean
}

export async function savePortfolioAction(data: PortfolioItemData, isEdit: boolean) {
  await connectToDatabase()
  
  if (isEdit && data.id) {
    await PortfolioModel.findByIdAndUpdate(data.id, data, { new: true })
  } else {
    const newItem = new PortfolioModel({
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    if (newItem.id && newItem.id.length < 24) {
      newItem._id = undefined
    }
    
    await newItem.save()
  }
  
  revalidatePath('/portfolio', 'page')
  revalidatePath('/admin/gallery', 'page')
}

export async function deletePortfolioAction(id: string) {
  await connectToDatabase()
  await PortfolioModel.findByIdAndDelete(id)
  
  revalidatePath('/portfolio', 'page')
  revalidatePath('/admin/gallery', 'page')
}

export async function togglePortfolioVisibleAction(id: string) {
  await connectToDatabase()
  const item = await PortfolioModel.findById(id)
  if (item) {
    item.is_visible = !item.is_visible
    await item.save()
  }
  
  revalidatePath('/portfolio', 'page')
  revalidatePath('/admin/gallery', 'page')
}

export async function getPortfoliosAction(onlyVisible: boolean = false) {
  await connectToDatabase()
  
  const query = onlyVisible ? { is_visible: true } : {}
  const items = await PortfolioModel.find(query).sort({ created_at: -1 })
  
  return items.map(toPlainObject) as PortfolioItemData[]
}

export async function getPortfolioByIdAction(id: string) {
  await connectToDatabase()
  const item = await PortfolioModel.findById(id)
  return toPlainObject(item) as PortfolioItemData | null
}
