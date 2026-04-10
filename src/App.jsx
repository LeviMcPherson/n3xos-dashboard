import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, Layers, ListChecks, Radio, GitBranch,
  Microscope, TrendingUp, Percent, Cpu, History
} from 'lucide-react'
import { USER_EMAIL } from './config'
import DashboardPage from './pages/Dashboard'
import SubstratePage from './pages/Substrate'
import DecisionsPage from './pages/Decisions'
import SignalsPage from './pages/Signals'
import CascadesPage from './pages/Cascades'
import SynthesisPage from './pages/Synthesis'
import PredictionsPage from './pages/Predictions'
import ProbabilityPage from './pages/Probability'
import EnginePage from './pages/Engine'
import AgentHistoryPage from './pages/AgentHistory'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/substrate', label: 'Substrate', icon: Layers },
  { to: '/decisions', label: 'Decision Queue', icon: ListChecks },
  { to: '/signals', label: 'Signals', icon: Radio },
  { to: '/cascades', label: 'Cascades', icon: GitBranch },
  { to: '/synthesis', label: 'Synthesis', icon: Microscope },
  { to: '/predictions', label: 'Predictions', icon: TrendingUp },
  { to: '/probability', label: 'Probability', icon: Percent },
  { to: '/engine', label: 'Engine', icon: Cpu },
  { to: '/agent-history', label: 'Agent History', icon: History },
]

export default function App() {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 bg-slate-900 border-r border-slate-700 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-slate-800">
          <h1 className="text-lg font-bold text-cyan-400 tracking-wide">N3XOS</h1>
          <p className="text-xs text-slate-500 mt-0.5">Operator Substrate</p>
        </div>
        <nav className="flex-1 py-2 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border-r-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <div className="text-xs text-slate-600">NXC â Tenant 001</div>
          <div className="text-xs text-slate-600 truncate">{USER_EMAIL}</div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/substrate" element={<SubstratePage />} />
          <Route path="/decisions" element={<DecisionsPage />} />
          <Route path="/signals" element={<SignalsPage />} />
          <Route path="/cascades" element={<CascadesPage />} />
          <Route path="/synthesis" element={<SynthesisPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/probability" element={<ProbabilityPage />} />
          <Route path="/engine" element={<EnginePage />} />
          <Route path="/agent-history" element={<AgentHistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
