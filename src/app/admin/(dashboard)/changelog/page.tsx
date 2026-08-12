'use client'

import { FileText, CheckCircle2, Bug, Zap } from 'lucide-react'

// ข้อมูล Changelog สามารถมาเพิ่มได้ตรงนี้
const changelogData = [
  {
    version: 'อัปเดตล่าสุด',
    date: '12 สิงหาคม 2026',
    changes: [
      { type: 'bug', text: 'แก้ไขแถบพื้นหลังสีดำ (Overlay) ในหน้าแรก เพื่อให้ตัวหนังสือโดดเด่นขึ้นมา' },
      { type: 'bug', text: 'แก้ไขระบบค้นหาด่วน "ทาวน์โฮม" ในหน้าแรก ให้ตรงกับค่าในฐานข้อมูล' },
      { type: 'improvement', text: 'อัปเกรดระบบกล่องค้นหา (Search Filter) เปลี่ยนมาใช้ form มาตรฐานเพื่อแก้ปัญหาหน้าจอไม่รีเฟรช' },
      { type: 'bug', text: 'แก้ไขบัคหน้าล็อกอินแอดมิน (รีเซ็ตแคชของระบบและรหัสผ่าน)' },
    ]
  },
  {
    version: 'แผนงาน SEO & AEO',
    date: 'กำลังดำเนินการ',
    changes: [
      { type: 'feature', text: 'ปรับปรุง Global SEO Foundation' },
      { type: 'feature', text: 'เพิ่ม Schema Markup (JSON-LD)' },
      { type: 'feature', text: 'ระบบวิเคราะห์ความแรง SEO ของบทความ/ทรัพย์' },
    ]
  }
]

export default function ChangelogPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'bug': return <Bug size={16} className="text-red-500" />
      case 'feature': return <Zap size={16} className="text-yellow-500" />
      default: return <CheckCircle2 size={16} className="text-forest-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bug': return 'Bug Fix'
      case 'feature': return 'New Feature'
      default: return 'Improvement'
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <FileText className="text-forest-600" />
          บันทึกการอัปเดตระบบ (Changelog)
        </h1>
        <p className="text-gray-500 mt-2">
          ประวัติการแก้ไขบัค เพิ่มฟีเจอร์ และการปรับปรุงระบบโดยทีมพัฒนา (AI)
        </p>
      </div>

      <div className="space-y-8">
        {changelogData.map((log, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            {/* Timeline dot style on left */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-forest-500 to-forest-300"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <h2 className="text-xl font-bold text-gray-900">{log.version}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-sm font-medium border border-gray-200">
                {log.date}
              </span>
            </div>

            <ul className="space-y-4">
              {log.changes.map((change, cIdx) => (
                <li key={cIdx} className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 bg-gray-50 rounded-lg shrink-0">
                    {getIcon(change.type)}
                  </div>
                  <div>
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                      {getTypeLabel(change.type)}
                    </span>
                    <p className="text-gray-700">{change.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
