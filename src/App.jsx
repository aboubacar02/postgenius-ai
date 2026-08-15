import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider } from './lib/app-context'
import { BackgroundFx } from './components/app-shell/background-fx'
import { Topbar } from './components/app-shell/topbar'
import { BottomNav } from './components/app-shell/bottom-nav'
import { Toaster } from './components/ui/sonner'
import DashboardPage from './pages/dashboard'
import GeneratorPage from './pages/generateur'
import ScorePage from './pages/score-viral'
import HistoryPage from './pages/historique'
import TendancesPage from './pages/tendances'
import PricingPage from './pages/tarifs'
import SettingsPage from './pages/parametres'

function AppShell() {
  const location = useLocation()
  return (
    <div className="relative min-h-screen">
      <BackgroundFx />
      <Topbar />
      <div className="relative z-10 flex min-h-screen flex-col">
        <main key={location.pathname} className="page-in flex-1 pb-24 pt-16 md:pb-10">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/generateur" element={<GeneratorPage />} />
            <Route path="/score-viral" element={<ScorePage />} />
            <Route path="/historique" element={<HistoryPage />} />
            <Route path="/tendances" element={<TendancesPage />} />
            <Route path="/tarifs" element={<PricingPage />} />
            <Route path="/parametres" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
        <Toaster />
      </AppProvider>
    </BrowserRouter>
  )
}