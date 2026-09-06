// Root admin layout — bare, no sidebar
// The sidebar is in (dashboard)/layout.tsx which only wraps dashboard/properties/inquiries
// Login page gets this bare layout only
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
