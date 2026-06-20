import AdminNav from '@/components/admin/AdminNav'

// This layout wraps only dashboard, properties, inquiries pages (not login)
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="lg:pl-64 pt-14 lg:pt-0">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
