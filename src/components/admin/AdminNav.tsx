'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Building2, MessageSquare, LogOut,
  Menu, X, ExternalLink, ChevronRight, Settings, Home, Users
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard', label: 'ภาพรวม', icon: LayoutDashboard },
  { href: '/admin/properties', label: 'จัดการทรัพย์', icon: Home },
  { href: '/admin/inquiries', label: 'ลูกค้าติดต่อ', icon: MessageSquare },
  { href: '/admin/settings', label: 'ตั้งค่าเว็บไซต์', icon: Settings },
  { href: '/admin/admins', label: 'ผู้ดูแลระบบ', icon: Users },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    // Clear demo bypass cookie
    document.cookie = "demo_admin=; path=/; max-age=0"
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">ตี๋</span>
          </div>
          <div>
            <div className="font-bold text-gray-900">ตี๋บางบอน</div>
            <div className="text-xs text-gray-500">ระบบจัดการ</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="px-3 py-4 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">เมนูหลัก</p>
        <ul className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`admin-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  {item.label}
                  {isActive && <ChevronRight size={14} className="ml-auto" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-nav-link text-sm"
        >
          <ExternalLink size={16} />
          ดูหน้าเว็บ
        </a>
        <button
          onClick={handleLogout}
          className="admin-nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
          ออกจากระบบ
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed left-0 top-0 h-full z-40 shadow-sm">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-forest-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">ตี๋</span>
          </div>
          <span className="font-bold text-gray-900">ตี๋บางบอน Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col animate-slide-up">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  )
}
