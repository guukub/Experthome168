'use server'

import { Property } from '@/types/property'
import { saveProperty as savePropertyToDemo, deleteProperty as deletePropertyFromDemo, updatePropertyStatus as updateStatusDemo, togglePropertyVisible as toggleVisibleDemo, togglePropertyFeatured as toggleFeaturedDemo } from '@/lib/sample-data'
import { revalidatePath } from 'next/cache'

export async function savePropertyAction(data: Property, isEdit: boolean) {
  savePropertyToDemo(data, isEdit)
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/properties')
  revalidatePath('/')
}

export async function deletePropertyAction(id: string) {
  deletePropertyFromDemo(id)
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/properties')
  revalidatePath('/')
}

export async function updatePropertyStatusAction(id: string, status: Property['status']) {
  updateStatusDemo(id, status)
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/properties')
  revalidatePath('/')
}

export async function togglePropertyVisibleAction(id: string) {
  toggleVisibleDemo(id)
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/properties')
  revalidatePath('/')
}

export async function togglePropertyFeaturedAction(id: string) {
  toggleFeaturedDemo(id)
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/properties')
  revalidatePath('/')
}

export async function getPropertiesAction() {
  const { getProperties } = await import('@/lib/sample-data')
  return getProperties()
}
