import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider } from './lib/app-context'
import { I18nProvider } from './lib/i18n'
import { BackgroundFx } from './components/app-shell/background-fx'
import { Topbar } from './components/app-shell/topbar'
import { SidebarNav } from './components/app-shell/sidebar-nav'
import { BottomNav } from './components/app-shell/bottom-nav'
import { CommandPalette } from './components/app-shell/command-palette'
import { AgentWidget } from './components/agent/agent-widget'
import { Toaster } from './components/ui/sonner'
import { Skeleton } from './components/ui/skeleton'

const DashboardPage = lazy(() => import('./pages/dashboard'))
const GeneratorPage = lazy(() => import('./pages/generateur'))
const ScorePage = lazy(() => import('./pages/score-viral'))
const HistoryPage = lazy(() => import('./pages/historique'))
const TendancesPage = lazy(() => import('./pages/tendances'))
const PricingPage = lazy(() => import('./pages/tarifs'))
const SettingsPage = lazy(() => import('./pages/parametres'))
const FacelessPage = lazy(() => import('./pages/faceless'))
const LoginPage = lazy(() => import('./pages/login'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center p-16">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-xs text-pg-muted">Chargement…</span>
      </div>
    </div>
  )
}

function AppShell() {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      <BackgroundFx />
      <Topbar onOpenCommandPalette={setPaletteOpen} />
      <SidebarNav collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <div
        className={`relative z-10 flex min-h-screen flex-col transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:pl-[76px] ${
          !sidebarCollapsed ? 'lg:pl-64' : ''
        }`}
      >
        <main key={location.pathname} className="page-in flex-1 pb-24 pt-16 md:pb-10">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/generateur" element={<GeneratorPage />} />
              <Route path="/score-viral" element={<ScorePage />} />
              <Route path="/historique" element={<HistoryPage />} />
              <Route path="/tendances" element={<TendancesPage />} />
              <Route path="/faceless" element={<FacelessPage />} />
              <Route path="/tarifs" element={<PricingPage />} />
              <Route path="/parametres" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <AppProvider>
          <AppShell />
          <AgentWidget />
          <Toaster />
        </AppProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}
