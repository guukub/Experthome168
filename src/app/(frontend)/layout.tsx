import { Noto_Sans_Thai } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { getSettingsAction } from '@/app/actions'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/schema'
import JsonLd from '@/components/seo/JsonLd'

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto'
})


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsAction()
  
  return {
    metadataBase: new URL('https://experthome168.com'),
    title: {
      default: 'Experthome168 ตี๋บางบอน | ซื้อ ขาย ฝากขาย อสังหาริมทรัพย์',
      template: '%s | Experthome168',
    },
    description: 'Experthome168 ตี๋บางบอน บริการซื้อ ขาย ฝากขาย บ้านเดี่ยว ทาวน์เฮ้าส์ คอนโด ที่ดิน ดูแลทุกขั้นตอน พร้อมให้คำปรึกษาฟรี นัดชมได้ทุกวัน',
    openGraph: {
      type: 'website',
      locale: 'th_TH',
      siteName: 'Experthome168',
      url: 'https://experthome168.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Experthome168 ตี๋บางบอน | ซื้อ ขาย ฝากขาย อสังหาริมทรัพย์',
      description: 'บริการซื้อ ขาย ฝากขาย อสังหาริมทรัพย์ ดูแลทุกขั้นตอน ปรึกษาฟรี',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: settings?.faviconUrl || '/icon.svg',
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettingsAction()
  const orgSchema = generateOrganizationSchema(settings || {})
  const webSiteSchema = generateWebSiteSchema()

  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} font-thai antialiased`}>
        <JsonLd data={orgSchema} />
        <JsonLd data={webSiteSchema} />
        {children}
      </body>
    </html>
  )
}
