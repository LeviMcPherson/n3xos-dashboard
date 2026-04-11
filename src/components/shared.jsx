import { RefreshCw, AlertTriangle, Eye, CheckCircle } from 'lucide-react'

// ─── LOADER ─────────────────────────────────────────────────
export function Loader() {
  return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
      <span className="ml-3 text-slate-400">Loading...</span>
    </div>
  )
}

// ─── ERROR ──────────────────────────────────────────────────
export function ErrorBox({ message, onRetry }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-red-800 text-center">
      <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
      <p className="text-red-300 mb-3">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-red-900 text-red-200 rounded hover:bg-red-800 text-sm">
          Retry
        </button>
      )}
    </div>
  )
}

// ─── KPI CARD ───────────────────────────────────────────────
const kpiColors = {
  cyan: 'border-cyan-600 text-cyan-400',
  amber: 'border-amber-600 text-amber-400',
  red: 'border-red-600 text-red-400',
  emerald: 'border-emerald-600 text-emerald-400',
  purple: 'border-purple-600 text-purple-400',
}

export function KpiCard({ label, value, sub, color = 'cyan' }) {
  const c = kpiColors[color] || kpiColors.cyan
  return (
    <div className={`bg-slate-800 rounded-lg p-4 border-l-4 ${c}`}>
      <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${c.split(' ')[1]}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

// ─── BADGE ──────────────────────────────────────────────────
const badgeStyles = {
  default: 'bg-slate-700 text-slate-300',
  critical: 'bg-red-900 text-red-300',
  high: 'bg-amber-900 text-amber-300',
  medium: 'bg-blue-900 text-blue-300',
  low: 'bg-slate-700 text-slate-400',
  open: 'bg-cyan-900 text-cyan-300',
  surfaced: 'bg-purple-900 text-purple-300',
  acknowledged: 'bg-indigo-900 text-indigo-300',
  resolved: 'bg-emerald-900 text-emerald-300',
  proposed: 'bg-amber-900 text-amber-300',
  approved: 'bg-cyan-900 text-cyan-300',
  executed: 'bg-emerald-900 text-emerald-300',
  active: 'bg-emerald-900 text-emerald-300',
  inactive: 'bg-slate-700 text-slate-500',
  observed: 'bg-cyan-900 text-cyan-300',
  completed: 'bg-emerald-900 text-emerald-300',
  failed: 'bg-red-900 text-red-300',
}

export function Badge({ text, variant = 'default' }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${badgeStyles[variant] || badgeStyles.default}`}>
      {text}
    </span>
  )
}

// ─── SBGM BAR ───────────────────────────────────────────────
export function SbgmBar({ sbgm, compact = false }) {
  if (!sbgm) return <span className="text-slate-600 text-xs">No SBGM read</span>
  const dims = [
    { key: 'S', label: 'Security', value: sbgm.security, color: 'bg-blue-500' },
    { key: 'B', label: 'Belonging', value: sbgm.belonging, color: 'bg-purple-500' },
    { key: 'G', label: 'Growth', value: sbgm.growth, color: 'bg-emerald-500' },
    { key: 'M', label: 'Meaning', value: sbgm.meaning, color: 'bg-amber-500' },
  ]
  const max = Math.max(...dims.map(d => d.value || 0))

  if (compact) {
    return (
      <div className="flex gap-1 items-end h-6">
        {dims.map(d => (
          <div key={d.key} className="flex flex-col items-center">
            <div className={`w-3 ${d.color} rounded-sm`} style={{ height: `${(d.value || 0) * 20}px` }} title={`${d.label}: ${((d.value || 0) * 100).toFixed(0)}%`} />
            <span className={`text-xs mt-0.5 ${d.value === max && max > 0 ? 'text-white font-bold' : 'text-slate-500'}`}>{d.key}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {dims.map(d => (
        <div key={d.key} className="flex items-center gap-2">
          <span className={`w-4 text-xs font-mono ${d.value === max && max > 0 ? 'text-white font-bold' : 'text-slate-500'}`}>{d.key}</span>
          <div className="flex-1 bg-slate-700 rounded-full h-2">
            <div className={`${d.color} h-2 rounded-full transition-all`} style={{ width: `${(d.value || 0) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-400 w-8 text-right">{((d.value || 0) * 100).toFixed(0)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── PC STAGE ───────────────────────────────────────────────
const pcFills = { cold: 0, curious: 25, engaged: 50, trusting: 75, aligned: 90, committed: 100 }
const pcColors = { cold: '#64748b', curious: '#38bdf8', engaged: '#22d3ee', trusting: '#2dd4bf', aligned: '#a78bfa', committed: '#34d399' }

export function PcStageIndicator({ stage, direction }) {
  const fill = pcFills[stage] ?? 0
  const color = pcColors[stage] || '#64748b'
  const arrows = { advancing: '\u2192', regressing: '\u2190', static: '\u2014' }
  return (
    <span className="inline-flex items-center gap-1 text-sm" title={`${stage} ${direction || ''}`}>
      <svg width="14" height="14" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="6" fill="none" stroke="#475569" strokeWidth="1.5" />
        {fill > 0 && (
          <circle cx="7" cy="7" r="5" fill={color} fillOpacity={fill / 100}
            stroke={color} strokeWidth={fill === 100 ? 0 : 0.5} />
        )}
      </svg>
      <span className="text-slate-400">{arrows[direction] || ''}</span>
    </span>
  )
}

// ─── TIME AGO ───────────────────────────────────────────────
export function TimeAgo({ date }) {
  if (!date) return <span className="text-slate-600">\u2014</span>
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  let text
  if (mins < 1) text = 'just now'
  else if (mins < 60) text = `${mins}m ago`
  else if (hrs < 24) text = `${hrs}h ago`
  else text = `${days}d ago`
  return <span className="text-slate-500 text-xs">{text}</span>
}

// ─── EMPTY STATE ────────────────────────────────────────────
export function EmptyState({ message, icon: Icon = Eye }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-500">
      <Icon className="w-12 h-12 mb-3 text-slate-600" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

// ─── PAGE HEADER ────────────────────────────────────────────
export function PageHeader({ title, count, onRefresh }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-slate-100">
        {title}{count != null ? ` (${count})` : ''}
      </h2>
      {onRefresh && (
        <button onClick={onRefresh} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      )}
    </div>
  )
}


// ─── SKELETON COMPONENTS ────────────────────────────────────
export function SkeletonPulse({ className = '' }) {
  return <div className={`animate-pulse bg-slate-700 rounded ${className}`} />
}

export function KpiSkeleton() {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border-l-4 border-slate-700 animate-pulse">
      <div className="bg-slate-700 rounded h-3 w-20 mb-2" />
      <div className="bg-slate-700 rounded h-7 w-16" />
    </div>
  )
}

export function CardSkeleton({ lines = 2 }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-slate-700 rounded h-5 w-14" />
        <div className="bg-slate-700 rounded h-5 w-16" />
      </div>
      <div className="bg-slate-700 rounded h-4 w-3/4 mb-1.5" />
      {lines > 1 && <div className="bg-slate-700 rounded h-3 w-1/2" />}
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-slate-700 rounded h-7 w-48 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
      <div>
        <div className="bg-slate-700 rounded h-4 w-32 mb-3 animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
      <div>
        <div className="bg-slate-700 rounded h-4 w-28 mb-3 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-lg p-3 animate-pulse flex items-center justify-between">
              <div>
                <div className="bg-slate-700 rounded h-4 w-28 mb-2" />
                <div className="flex gap-2"><div className="bg-slate-700 rounded h-5 w-12" /><div className="bg-slate-700 rounded h-5 w-14" /></div>
              </div>
              <div className="bg-slate-700 rounded h-8 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DecisionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-slate-700 rounded h-7 w-44 animate-pulse" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-slate-800 rounded h-7 animate-pulse" style={{ width: `${50 + i * 10}px` }} />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  )
}

export function SubstrateSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="bg-slate-700 rounded h-7 w-36 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-4 animate-pulse space-y-3">
            <div className="flex items-center gap-2"><div className="bg-slate-700 rounded h-5 w-32" /><div className="bg-slate-700 rounded h-5 w-14" /></div>
            <div className="bg-slate-700 rounded h-3 w-full" />
            <div className="bg-slate-700 rounded h-3 w-2/3" />
            <div className="flex gap-1 items-end h-6">
              {Array.from({ length: 4 }).map((_, j) => <div key={j} className="bg-slate-700 rounded w-3" style={{ height: `${8 + j * 4}px` }} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
