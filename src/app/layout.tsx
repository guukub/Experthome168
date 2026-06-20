import type { Metadata } from 'next'
import './globals.css'

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sarabun antialiased">{children}</body>
    </html>
  )
}
