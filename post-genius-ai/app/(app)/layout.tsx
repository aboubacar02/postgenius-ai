import { BackgroundFx } from '@/components/app-shell/background-fx'
import { SidebarNav } from '@/components/app-shell/sidebar-nav'
import { Topbar } from '@/components/app-shell/topbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <BackgroundFx />
      <SidebarNav />
      <div className="relative z-10 flex min-h-screen flex-col lg:pl-64">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
