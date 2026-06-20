import { Phone, MessageCircle, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest-800 text-white py-8">
      <div className="container-main">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          
          {/* Logo & Description */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-forest-800 font-bold text-xl">ตี๋</span>
              </div>
              <div>
                <div className="font-bold text-white text-xl leading-tight">ตี๋บางบอน</div>
                <div className="text-xs text-forest-200 leading-tight tracking-wide mt-0.5">เพื่อนคู่คิด คนหาบ้าน</div>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-forest-600 mx-2"></div>
            <p className="text-sm text-forest-100 max-w-xs leading-relaxed">
              ศูนย์รวมบ้านมือสองคุณภาพ คัดสรรทุกหลัง<br/>ด้วยความใส่ใจ เพื่อให้คุณได้บ้านที่ใช่
            </p>
          </div>

          {/* Contacts */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-3">
              <a href="tel:+66812345678" className="w-10 h-10 bg-white text-forest-800 rounded-full flex items-center justify-center hover:bg-forest-50 transition-colors shrink-0">
                <Phone size={18} />
              </a>
              <div>
                <a href="tel:+66812345678" className="font-bold block hover:text-forest-200 transition-colors">081-123-4567</a>
                <span className="text-xs text-forest-200">ทุกวัน 09.00 - 18.00 น.</span>
              </div>
            </div>
            
            <div className="hidden sm:block w-px h-10 bg-forest-600"></div>

            <div className="flex items-center gap-3">
              <a href="https://line.me/ti/p/~@teebangbon" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-green-600 rounded-full flex items-center justify-center hover:bg-forest-50 transition-colors shrink-0">
                <span className="font-extrabold text-[10px]">LINE</span>
              </a>
              <div>
                <a href="https://line.me/ti/p/~@teebangbon" target="_blank" rel="noopener noreferrer" className="font-bold block hover:text-forest-200 transition-colors">@teebangbon</a>
                <span className="text-xs text-forest-200">ตอบไว แชทได้เลย</span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-forest-600"></div>

            <div className="flex items-center gap-3">
              <a href="https://facebook.com/teebangbon" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center hover:bg-forest-50 transition-colors shrink-0">
                <Facebook size={18} />
              </a>
              <div>
                <a href="https://facebook.com/teebangbon" target="_blank" rel="noopener noreferrer" className="font-bold block hover:text-forest-200 transition-colors">facebook.com/teebangbon</a>
                <span className="text-xs text-forest-200">ติดตามทรัพย์ใหม่ก่อนใคร</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

