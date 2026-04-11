import { useState, useEffect } from 'react'
import { X, ArrowRight, Layers, ListChecks, Radio, Cpu } from 'lucide-react'

const STEPS = [
  {
    title: 'Command Dashboard',
    description: 'Your operational nerve center. KPIs, open decisions, and client health at a glance.',
    icon: Layers,
    nav: '/',
  },
  {
    title: 'Decision Queue',
    description: 'Every decision the substrate surfaces. Resolve or defer with one click \u2014 each action feeds the learning loop.',
    icon: ListChecks,
    nav: '/decisions',
  },
  {
    title: 'Signal Stream',
    description: 'Raw behavioral signals from Gmail, Slack, and calendar. The substrate watches so you don\'t have to.',
    icon: Radio,
    nav: '/signals',
  },
  {
    title: 'Substrate Engine',
    description: 'The judgment layer. Every scan, inference, and buyer code read flows through here. Fully explainable, fully overridable.',
    icon: Cpu,
    nav: '/substrate',
  },
]

const STORAGE_KEY = 'n3xos_walkthrough_seen'

export default function Walkthrough({ onNavigate }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!window.sessionStorage.getItem(STORAGE_KEY)) {
        setVisible(true)
      }
    } catch { setVisible(true) }
  }, [])

  function dismiss() {
    setVisible(false)
    try { window.sessionStorage.setItem(STORAGE_KEY, '1') } catch {}
  }

  function next() {
    if (step < STEPS.length - 1) {
      const nextStep = step + 1
      setStep(nextStep)
      if (onNavigate) onNavigate(STEPS[nextStep].nav)
    } else {
      dismiss()
    }
  }

  if (!visible) return null
  const current = STEPS[step]
  const Icon = current.icon

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 pointer-events-none">
      <div className="bg-slate-800 border border-cyan-600/40 rounded-xl shadow-2xl shadow-cyan-900/20 p-5 max-w-md w-full mx-4 pointer-events-auto">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 flex items-center justify-center">
              <Icon className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Step {step + 1} of {STEPS.length}</p>
              <h3 className="text-sm font-semibold text-slate-100">{current.title}</h3>
            </div>
          </div>
          <button onClick={dismiss} className="text-slate-500 hover:text-slate-300 p-1">
            <X size={14} />
          </button>
        </div>
        <p className="text-sm text-slate-400 mb-4">{current.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === step ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-600'}`} />
            ))}
          </div>
          <button onClick={next} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-cyan-600 text-white hover:bg-cyan-500 transition-colors">
            {step < STEPS.length - 1 ? 'Next' : 'Get Started'}
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
