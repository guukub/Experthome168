import PropertyForm from '@/components/admin/PropertyForm'
import { getPropertiesAction, getSettingsAction } from '@/app/actions'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const allProps = await getPropertiesAction()
  const property = allProps.find(p => p.id === params.id)
  
  if (!property) {
    notFound()
  }

  const settings = await getSettingsAction()

  return <PropertyForm isEdit={true} initialData={property} propertyTypes={settings?.propertyTypes} />
}
