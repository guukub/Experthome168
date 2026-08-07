import GalleryForm from '@/components/admin/GalleryForm'
import { getPortfolioByIdAction } from '@/app/portfolioActions'
import { notFound } from 'next/navigation'

export default async function EditGalleryPage({ params }: { params: { id: string } }) {
  const item = await getPortfolioByIdAction(params.id)
  
  if (!item) {
    notFound()
  }

  return <GalleryForm initialData={item} isEdit />
}
