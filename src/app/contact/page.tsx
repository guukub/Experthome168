import { Metadata } from 'next'
import { getSettingsAction } from '@/app/actions'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { Phone, MessageCircle, Facebook, MapPin, Clock, Mail, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ติดต่อเรา',
  description: 'ติดต่อตี๋บางบอน นายหน้าอสังหาริมทรัพย์ โทร ไลน์ เฟซบุ๊ก หรือกรอกฟอร์ม',
}

export default async function ContactPage() {
  const settings = await getSettingsAction()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-forest-800 to-forest-950 text-white py-14">
          <div className="container-main text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">ติดต่อตี๋บางบอน</h1>
            <p className="text-forest-200 text-lg">พร้อมช่วยคุณทุกวัน ตั้งแต่ 8 โมงเช้า ถึง 2 ทุ่ม</p>
          </div>
        </div>

        <div className="container-main py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ช่องทางติดต่อ</h2>

              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: Phone, label: 'โทรศัพท์', value: settings.phone,
                    href: `tel:${(settings.phone || '').replace(/\D/g, '')}`, color: 'bg-forest-600', desc: 'โทรได้ตลอด ไม่ต้องรอนาน'
                  },
                  {
                    icon: MessageCircle, label: 'Line', value: settings.lineId,
                    href: settings.lineUrl || '#', color: 'bg-green-500', desc: 'แชทได้เลย ตอบเร็ว'
                  },
                  {
                    icon: Facebook, label: 'Facebook', value: settings.facebook || 'ตี๋บางบอน อสังหาฯ',
                    href: settings.facebookUrl || '#', color: 'bg-blue-600', desc: 'ดูรูปและข้อมูลทรัพย์'
                  },
                  {
                    icon: Mail, label: 'อีเมล', value: 'info@teebangbon.com',
                    href: 'mailto:info@teebangbon.com', color: 'bg-red-500', desc: 'สำหรับเอกสารและสัญญา'
                  },
                ].map(channel => {
                  const Icon = channel.icon
                  return (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target={channel.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      <div className={`w-12 h-12 ${channel.color} text-white rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{channel.label}: {channel.value}</div>
                        <div className="text-sm text-gray-500">{channel.desc}</div>
                      </div>
                    </a>
                  )
                })}
              </div>

              {/* Info */}
              <div className="bg-forest-50 rounded-2xl p-6 border border-forest-100">
                <h3 className="font-bold text-forest-800 mb-4">ข้อมูลสำนักงาน</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-forest-700">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-forest-500" />
                    <span>{settings.address}</span>
                  </li>
                  <li className="flex items-center gap-3 text-forest-700">
                    <Clock size={18} className="shrink-0 text-forest-500" />
                    <span>{settings.workingHours}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">ส่งข้อความถึงเรา</h2>
              <div className="card p-6">
                <ContactForm lineId={settings.lineId} />
              </div>

              {/* CTA Cards */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-forest-600 to-forest-800 text-white rounded-2xl">
                  <div className="text-2xl mb-2">🏠</div>
                  <h3 className="font-bold mb-1">ฝากขายกับเรา</h3>
                  <p className="text-forest-100 text-sm">มีทรัพย์อยากขาย? เราช่วยหาผู้ซื้อฟรี ไม่มีค่าใช้จ่ายล่วงหน้า</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-gold-500 to-gold-700 text-white rounded-2xl">
                  <div className="text-2xl mb-2">🔍</div>
                  <h3 className="font-bold mb-1">หาบ้านตามใจ</h3>
                  <p className="text-gold-100 text-sm">บอกความต้องการมา เราจะค้นหาทรัพย์ที่ตรงใจคุณที่สุด</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function ContactForm({ lineId }: { lineId: string }) {
  return (
    <form action="/api/inquiries" method="POST" className="space-y-4">
      <div>
        <label className="label" htmlFor="contact-name">ชื่อ-นามสกุล *</label>
        <input id="contact-name" type="text" name="name" required placeholder="ชื่อของคุณ" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="contact-phone">เบอร์โทรศัพท์ *</label>
        <input id="contact-phone" type="tel" name="phone" required placeholder="08X-XXX-XXXX" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="contact-subject">เรื่องที่ต้องการ</label>
        <select id="contact-subject" name="subject" className="select">
          <option value="">เลือกประเภท</option>
          <option>สอบถามทรัพย์</option>
          <option>นัดชมทรัพย์</option>
          <option>ฝากขายทรัพย์</option>
          <option>อื่นๆ</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="contact-message">ข้อความ</label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          placeholder="รายละเอียดที่ต้องการสอบถาม..."
          className="input resize-none"
        />
      </div>
      <button type="submit" className="btn-primary w-full justify-center py-3.5 text-base">
        <Send size={18} /> ส่งข้อความ
      </button>
      <p className="text-xs text-gray-400 text-center">
        หรือติดต่อโดยตรงทาง Line: {lineId} เพื่อรับการตอบกลับที่รวดเร็วกว่า
      </p>
    </form>
  )
}
