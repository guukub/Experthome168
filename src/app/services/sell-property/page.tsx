import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { generateFAQSchema } from '@/lib/seo/schema'
import JsonLd from '@/components/seo/JsonLd'
import { CheckCircle2, ChevronRight, Home, Building2, Trees, Phone, Send, MessageCircle } from 'lucide-react'
import { getSettingsAction } from '@/app/actions'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'รับฝากขายบ้าน คอนโด ที่ดิน | ตี๋บางบอน Experthome168',
  description: 'บริการรับฝากขายบ้าน คอนโด และที่ดิน โดย Experthome168 ช่วยวิเคราะห์ราคา วางแผนการขาย ทำการตลาด ประสานงานเอกสาร และดูแลจนถึงวันโอน',
  alternates: {
    canonical: 'https://experthome168.com/services/sell-property',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'รับฝากขายบ้าน คอนโด ที่ดิน | ตี๋บางบอน Experthome168',
    description: 'บริการรับฝากขายบ้าน คอนโด และที่ดิน โดย Experthome168 ช่วยวิเคราะห์ราคา วางแผนการขาย ทำการตลาด ประสานงานเอกสาร และดูแลจนถึงวันโอน',
    url: 'https://experthome168.com/services/sell-property',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'รับฝากขายบ้าน คอนโด ที่ดิน | ตี๋บางบอน Experthome168',
    description: 'บริการรับฝากขายบ้าน คอนโด และที่ดิน โดย Experthome168 ช่วยวิเคราะห์ราคา วางแผนการขาย ทำการตลาด ประสานงานเอกสาร และดูแลจนถึงวันโอน',
  },
}

export default async function SellPropertyPage() {
  const settings = await getSettingsAction()

  const faqs = [
    {
      question: 'ฝากขายบ้านกับนายหน้าช่วยเรื่องอะไรบ้าง?',
      answer: 'ช่วยประเมินและตั้งราคาที่เหมาะสม ถ่ายภาพและจัดทำสื่อโฆษณา ทำการตลาดในช่องทางต่างๆ คัดกรองผู้ซื้อ พาผู้สนใจเข้าชมทรัพย์ และช่วยประสานงานด้านเอกสารและสินเชื่อจนถึงวันโอนกรรมสิทธิ์'
    },
    {
      question: 'บ้านที่ยังติดธนาคารฝากขายได้ไหม?',
      answer: 'สามารถฝากขายได้ตามปกติ โดยหากมีการตกลงซื้อขาย ทางเราจะประสานงานกับธนาคารเพื่อทำเรื่องไถ่ถอนและโอนกรรมสิทธิ์ ณ สำนักงานที่ดินในวันเดียวกัน'
    },
    {
      question: 'ต้องเตรียมข้อมูลอะไรเพื่อเริ่มฝากขาย?',
      answer: 'ข้อมูลพื้นฐานที่ต้องเตรียม ได้แก่ สำเนาโฉนดที่ดินหน้า-หลัง, ราคาที่ต้องการขายในใจ, รูปภาพบ้านหรืออนุญาตให้เข้าไปถ่ายรูป, และข้อมูลรายละเอียดของทรัพย์ เช่น ขนาดพื้นที่ จำนวนห้องนอน ห้องน้ำ'
    },
    {
      question: 'รับฝากขายอสังหาริมทรัพย์ประเภทไหนบ้าง?',
      answer: 'Experthome168 รับฝากขาย บ้านเดี่ยว ทาวน์เฮ้าส์ คอนโดมิเนียม ที่ดินเปล่า และอาคารพาณิชย์ ในพื้นที่ให้บริการ'
    },
    {
      question: 'ตั้งราคาขายบ้านอย่างไร?',
      answer: 'เราจะช่วยวิเคราะห์ราคาตลาดเปรียบเทียบกับทรัพย์ในทำเลเดียวกัน (Comparative Market Analysis) เพื่อหาช่วงราคาที่เหมาะสมที่สุด ทั้งนี้การตัดสินใจตั้งราคาขายสุดท้ายจะขึ้นอยู่กับความต้องการของเจ้าของทรัพย์เป็นหลัก'
    },
    {
      question: 'หลังมีผู้สนใจแล้วมีขั้นตอนอะไรต่อ?',
      answer: 'เราจะคัดกรองผู้ซื้อเบื้องต้น นัดหมายพาเข้าชมทรัพย์ หากผู้ซื้อตกลงซื้อ เราจะช่วยประสานงานเรื่องการวางมัดจำ สัญญาจะซื้อจะขาย และดูแลเรื่องการขอสินเชื่อของผู้ซื้อ ไปจนถึงการนัดวันโอนที่สำนักงานที่ดิน'
    }
  ]

  const faqSchema = generateFAQSchema(faqs)

  return (
    <>
      <Navbar />
      <JsonLd data={faqSchema} />
      
      <main className="min-h-screen bg-gray-50 pt-[72px]">
        {/* 1. HERO */}
        <section className="relative bg-forest-900 text-white overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="container-main relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              รับฝากขายบ้าน คอนโด และที่ดิน
              <span className="block text-gold-400 mt-2 text-2xl md:text-3xl lg:text-4xl">ดูแลตั้งแต่ประเมินราคา จนถึงวันโอน</span>
            </h1>
            <p className="text-forest-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              ตัวแทนขายอสังหาริมทรัพย์มืออาชีพ (นายหน้าขายบ้าน) ประสบการณ์จริงในพื้นที่ ช่วยคุณจัดการทุกขั้นตอนเพื่อการขายที่ราบรื่น
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#contact" className="btn-primary text-lg py-4 px-8 justify-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                ปรึกษาฝากขาย
              </a>
              <Link href="/portfolio" className="btn-outline text-lg py-4 px-8 justify-center border-white text-white hover:bg-white/10 hover:text-white hover:border-white">
                ดูผลงานของเรา
              </Link>
            </div>
          </div>
        </section>

        {/* 2. DIRECT ANSWER / AEO SECTION */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-main max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">บริการรับฝากขายช่วยอะไรบ้าง?</h2>
              <p className="text-gray-600 text-lg">เราทำงานแบบครบวงจร เพื่อลดภาระและประหยัดเวลาของเจ้าของทรัพย์</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'วิเคราะห์และวางราคาขาย', desc: 'เปรียบเทียบข้อมูลตลาด เพื่อหาราคาที่เหมาะสมในการแข่งขัน' },
                { title: 'เตรียมข้อมูลทรัพย์', desc: 'ลงพื้นที่สำรวจ ถ่ายภาพ และจัดเตรียมข้อมูลรายละเอียดเพื่อนำเสนอ' },
                { title: 'ทำการตลาด', desc: 'ลงโฆษณาในแพลตฟอร์มอสังหาริมทรัพย์ชั้นนำและโซเชียลมีเดีย' },
                { title: 'คัดกรองผู้สนใจ', desc: 'ตรวจสอบความต้องการเบื้องต้นก่อนพานัดชมทรัพย์จริง' },
                { title: 'ประสานงานเอกสาร', desc: 'ดูแลสัญญาจะซื้อจะขาย และให้คำแนะนำเรื่องสินเชื่อกับฝั่งผู้ซื้อ' },
                { title: 'ดูแลจนถึงวันโอนกรรมสิทธิ์', desc: 'คำนวณค่าใช้จ่าย และอำนวยความสะดวก ณ สำนักงานที่ดิน' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-6 bg-forest-50 rounded-2xl border border-forest-100/50 hover:shadow-md transition-shadow">
                  <div className="shrink-0 mt-1 text-forest-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. WHY EXPERTHOME168 & 6. PORTFOLIO TRUST SECTION */}
        <section className="py-16 md:py-24 bg-forest-900 text-white">
          <div className="container-main max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">ความน่าเชื่อถือที่คุณตรวจสอบได้</h2>
            <p className="text-forest-100 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
              Experthome168 (ตี๋บางบอน) มีประวัติการทำงานและผลงานปิดการขายจริงที่สามารถอ้างอิงได้ เราเป็นนายหน้าอสังหาริมทรัพย์ที่เน้นการทำงานอย่างตรงไปตรงมา และมีแฟ้มผลงานรวมความสำเร็จในการดูแลทรัพย์ให้กับลูกค้า
            </p>
            <Link href="/portfolio" className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg">
              ดูผลงานของเรา <ChevronRight size={20} />
            </Link>
          </div>
        </section>

        {/* 4. SELLING PROCESS */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-main max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">ขั้นตอนการฝากขายอสังหาริมทรัพย์</h2>
              <p className="text-gray-600 text-lg">7 ขั้นตอนชัดเจน เพื่อความโปร่งใสในการทำงาน</p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto relative before:absolute before:inset-0 before:ml-6 md:before:ml-8 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-forest-200 before:via-forest-300 before:to-forest-200">
              {[
                { step: '1', title: 'ส่งข้อมูลทรัพย์', desc: 'เจ้าของทรัพย์ส่งรายละเอียดเบื้องต้น เช่น รูปภาพ โลเคชั่น และความต้องการขาย' },
                { step: '2', title: 'วิเคราะห์ทรัพย์และราคา', desc: 'เราทำการวิเคราะห์ความเป็นไปได้ และให้คำแนะนำเรื่องราคาตลาดที่เหมาะสม' },
                { step: '3', title: 'วางแผนการขาย', desc: 'เซ็นสัญญาแต่งตั้งนายหน้า และจัดเตรียมสื่อสำหรับการขาย' },
                { step: '4', title: 'ทำการตลาด', desc: 'ลงประกาศโฆษณาในช่องทางต่างๆ เพื่อเข้าถึงกลุ่มเป้าหมาย' },
                { step: '5', title: 'คัดกรองและเจรจากับผู้สนใจ', desc: 'คัดกรองผู้ที่มีกำลังซื้อ นัดชมทรัพย์ และเป็นตัวกลางในการเจรจาต่อรอง' },
                { step: '6', title: 'ประสานด้านเอกสาร/สินเชื่อ', desc: 'ทำสัญญาจะซื้อจะขาย และช่วยแนะนำกระบวนการยื่นกู้ให้กับฝั่งผู้ซื้อตามความเหมาะสม' },
                { step: '7', title: 'ดูแลการดำเนินการจนถึงวันโอน', desc: 'สรุปค่าใช้จ่ายล่วงหน้า และอำนวยความสะดวกในวันโอนกรรมสิทธิ์ ณ สำนักงานที่ดิน' }
              ].map((item, i) => (
                <div key={i} className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-forest-600 text-white font-bold text-lg shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {item.step}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-white border border-gray-100 shadow-sm rounded-2xl group-hover:shadow-md transition-shadow group-hover:border-forest-200">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. PROPERTY TYPES */}
        <section className="py-16 bg-gray-50 border-y border-gray-200">
          <div className="container-main max-w-5xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-10">เรารับฝากขายอสังหาริมทรัพย์ประเภทใดบ้าง?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Home size={32} />, label: 'บ้านเดี่ยว' },
                { icon: <Home size={32} />, label: 'ทาวน์เฮ้าส์' },
                { icon: <Building2 size={32} />, label: 'คอนโดมิเนียม' },
                { icon: <Trees size={32} />, label: 'ที่ดินเปล่า' }
              ].map((type, i) => (
                <div key={i} className="flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm text-forest-700">
                  <div className="mb-4 text-forest-600 bg-forest-50 p-4 rounded-full">{type.icon}</div>
                  <h3 className="font-bold">{type.label}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FAQ / AEO */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container-main max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">คำถามที่พบบ่อย (FAQ)</h2>
              <p className="text-gray-600">ข้อสงสัยทั่วไปเกี่ยวกับการฝากขายอสังหาริมทรัพย์</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between p-6 text-lg font-semibold cursor-pointer text-gray-900">
                    {faq.question}
                    <span className="shrink-0 ml-4 p-1 rounded-full bg-white text-forest-600 transition duration-300 group-open:rotate-180 group-open:bg-forest-600 group-open:text-white">
                      <ChevronRight size={20} className="rotate-90" />
                    </span>
                  </summary>
                  <div className="p-6 pt-0 text-gray-600 leading-relaxed bg-white border-t border-gray-100">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FINAL CTA & INQUIRY FORM */}
        <section id="contact" className="py-16 md:py-24 bg-forest-900 relative">
          <div className="container-main max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">มีบ้าน คอนโด หรือที่ดินที่ต้องการขาย?</h2>
                <p className="text-forest-100 text-lg mb-8">
                  ส่งข้อมูลทรัพย์ของคุณเพื่อประเมินเบื้องต้น หรือพูดคุยสอบถามเงื่อนไขการให้บริการฝากขายกับ Experthome168 ได้ฟรี
                </p>
                
                <div className="space-y-6 mb-10">
                  <a href={`tel:${settings?.phone?.replace(/\D/g, '')}`} className="flex items-center gap-4 text-xl hover:text-gold-400 transition-colors">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                      <Phone size={24} />
                    </div>
                    {settings?.phone || '08X-XXX-XXXX'}
                  </a>
                  <a href={settings?.lineUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-xl hover:text-gold-400 transition-colors">
                    <div className="w-12 h-12 bg-[#00B900]/20 text-[#00B900] rounded-full flex items-center justify-center bg-white/10">
                      <MessageCircle size={24} />
                    </div>
                    Line ID: {settings?.lineId || '@teebangbon'}
                  </a>
                </div>

                <Link href="/contact" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold underline underline-offset-4">
                  ดูช่องทางการติดต่อทั้งหมด <ChevronRight size={16} />
                </Link>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">ส่งข้อมูลทรัพย์เพื่อปรึกษาเบื้องต้น</h3>
                <form action="/api/inquiries" method="POST" className="space-y-4">
                  <div>
                    <label className="label" htmlFor="contact-name">ชื่อ-นามสกุล *</label>
                    <input id="contact-name" type="text" name="name" required placeholder="ชื่อของคุณ" className="input" />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-phone">เบอร์โทรศัพท์ *</label>
                    <input id="contact-phone" type="tel" name="phone" required placeholder="08X-XXX-XXXX" className="input" />
                  </div>
                  <input type="hidden" name="subject" value="ฝากขายทรัพย์" />
                  <div>
                    <label className="label" htmlFor="contact-message">รายละเอียดทรัพย์ (ทำเล, ประเภท, ราคาที่ต้องการขาย)</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      placeholder="เช่น บ้านเดี่ยว 50 ตร.ว. ซอยประชาอุทิศ ราคา 3 ล้านบาท..."
                      className="input resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center py-4 text-lg mt-2">
                    <Send size={20} className="mr-2" /> ส่งข้อมูล
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
