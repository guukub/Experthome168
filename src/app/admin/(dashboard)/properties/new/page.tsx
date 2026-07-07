import PropertyForm from '@/components/admin/PropertyForm'
import { getSettingsAction } from '@/app/actions'

export const dynamic = 'force-dynamic'

export default async function NewPropertyPage() {
  const settings = await getSettingsAction()
  return <PropertyForm isEdit={false} propertyTypes={settings?.propertyTypes} />
}
