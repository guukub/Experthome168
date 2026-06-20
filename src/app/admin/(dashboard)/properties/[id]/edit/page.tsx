import PropertyForm from '@/components/admin/PropertyForm'
import { sampleProperties } from '@/lib/sample-data'
import { notFound } from 'next/navigation'

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = sampleProperties.find(p => p.id === params.id)
  
  if (!property) {
    notFound()
  }

  return <PropertyForm isEdit={true} initialData={property} />
}
