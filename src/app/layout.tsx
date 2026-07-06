import { Noto_Sans_Thai } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto'
})

export const metadata: Metadata = {
  title: {
    default: 'ตี๋บางบอน | อสังหาริมทรัพย์คุณภาพ',
    template: '%s | ตี๋บางบอน',
  },
  description: 'ตี๋บางบอน ผู้เชี่ยวชาญด้านอสังหาริมทรัพย์ บ้านเดี่ยว ทาวน์เฮ้าส์ คอนโด ที่ดิน ย่านบางบอน หนองแขม พุทธบูชา บางแค พร้อมบริการนัดชม สอบถาม ฝากขาย',
  keywords: 'บ้านขาย, อสังหาริมทรัพย์, บางบอน, หนองแขม, ทาวน์เฮ้าส์, บ้านเดี่ยว, ที่ดิน',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: 'ตี๋บางบอน อสังหาริมทรัพย์',
  },
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
