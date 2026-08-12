import { Noto_Sans_Thai } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto'
})

import { getSettingsAction } from '@/app/actions'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettingsAction()
  
  return {
    metadataBase: new URL('https://experthome168.com'),
    title: {
      default: 'Expert Home 168 | อสังหาริมทรัพย์คุณภาพ',
      template: '%s | Expert Home 168',
    },
    description: 'Expert Home 168 ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์ บ้านเดี่ยว ทาวน์เฮ้าส์ คอนโด ที่ดิน ย่านบางบอน หนองแขม พุทธบูชา บางแค พร้อมบริการนัดชม สอบถาม ฝากขาย',
    keywords: 'บ้านขาย, อสังหาริมทรัพย์, บางบอน, หนองแขม, ทาวน์เฮ้าส์, บ้านเดี่ยว, ที่ดิน, Expert Home 168',
    openGraph: {
      type: 'website',
      locale: 'th_TH',
      siteName: 'Expert Home 168',
      url: 'https://experthome168.com',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Expert Home 168 | อสังหาริมทรัพย์คุณภาพ',
      description: 'ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์ บริการนัดชม สอบถาม ฝากขาย',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={`${notoSansThai.variable} font-thai antialiased`}>{children}</body>
    </html>
  )
}
