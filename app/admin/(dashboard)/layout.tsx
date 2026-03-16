import AdminSidebar from '@/components/admin/AdminSidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-stone-50 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto pt-14 md:pt-0">{children}</main>
    </div>
  )
}
