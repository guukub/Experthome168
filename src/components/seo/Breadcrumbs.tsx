import Link from 'next/link'
import JsonLd from './JsonLd'
import { generateBreadcrumbSchema } from '@/lib/seo/schema'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbsProps {
  items: { name: string; href: string }[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = items.map(item => ({
    name: item.name,
    item: `https://experthome168.com${item.href}`
  }))

  const schema = generateBreadcrumbSchema(schemaItems)

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 py-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <div key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-gray-900 font-medium truncate" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-forest-600 transition-colors">
                    {item.name}
                  </Link>
                  <ChevronRight size={14} className="text-gray-400 shrink-0" />
                </>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )
}
