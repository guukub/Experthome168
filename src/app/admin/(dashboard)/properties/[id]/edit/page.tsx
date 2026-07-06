import PropertyForm from '@/components/admin/PropertyForm'
import { getPropertiesAction } from '@/app/actions'
import { notFound } from 'next/navigation'

export default async function EditPropertyPage({ params }: { params: { id: string } }) {
  const allProps = await getPropertiesAction()
  const property = allProps.find(p => p.id === params.id)
  
  if (!property) {
    notFound()
  }

  return <PropertyForm isEdit={true} initialData={property} />
}
