import { useState } from 'react'
import { ListChecks, Check, Clock } from 'lucide-react'
import { useApi } from '../hooks'
import { pageUrl, API_BASE, TENANT_ID } from '../config'
import { DecisionsSkeleton, ErrorBox, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

async function resolveDecision(decisionId, resolutionType, notes = null) {
  const res = await fetch(`${API_BASE}/n3xos-resolve-decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      decision_id: decisionId,
      tenant_id: TENANT_ID,
      resolution_type: resolutionType,
      resolution_notes: notes,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`${res.status}: ${body}`)
  }
  return res.json()
}

const ACTIONABLE = new Set(['open', 'surfaced', 'pending'])

export default function DecisionsPage() {
  const { data, loading, error, reload } = useApi(pageUrl('decisions'))
  const [filter, setFilter] = useState('all')
  const [acting, setActing] = useState(null) // decision id currently being acted on
  const [actionError, setActionError] = useState(null)

  if (loading) return <DecisionsSkeleton />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const all = data.decisions || []
  const statuses = [...new Set(all.map(d => d.status).filter(Boolean))]
  const filtered = filter === 'all' ? all : all.filter(d => d.status === filter)

  async function handleAction(decisionId, type) {
    setActing(decisionId)
    setActionError(null)
    try {
      await resolveDecision(decisionId, type)
      reload()
    } catch (e) {
      setActionError(`Failed to ${type}: ${e.message}`)
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Decision Queue" count={all.length} onRefresh={reload} />

      {actionError && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg px-4 py-2 text-sm text-red-300">
          {actionError}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded text-xs ${filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
          All ({all.length})
        </button>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded text-xs ${filter === s ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
            {s} ({all.filter(d => d.status === s).length})
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(d => {
          const canAct = ACTIONABLE.has(d.status)
          const isActing = acting === d.id
          return (
            <div key={d.id} className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge text={d.urgency || '—'} variant={d.urgency} />
                    <Badge text={d.status} variant={d.status} />
                  </div>
                  <p className="text-sm text-slate-200">{d.title}</p>
                  {d.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{d.description}</p>}

                  {canAct && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleAction(d.id, 'resolved')}
                        disabled={isActing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-600/40 hover:bg-emerald-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <Check size={13} />
                        {isActing ? 'Resolving…' : 'Resolve'}
                      </button>
                      <button
                        onClick={() => handleAction(d.id, 'deferred')}
                        disabled={isActing}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-amber-600/20 text-amber-400 border border-amber-600/40 hover:bg-amber-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        <Clock size={13} />
                        {isActing ? 'Deferring…' : 'Defer'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-right ml-4 shrink-0 space-y-1">
                  {d.mrr_impact > 0 && <div className="text-sm text-amber-400 font-medium">${parseFloat(d.mrr_impact).toLocaleString()}</div>}
                  {d.probability_score != null && <div className="text-xs text-slate-400">{(d.probability_score * 100).toFixed(0)}% probability</div>}
                  {d.days_to_consequence != null && <div className="text-xs text-slate-500">{d.days_to_consequence} days to consequence</div>}
                  <TimeAgo date={d.created_at} />
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && <EmptyState message="No decisions match this filter" icon={ListChecks} />}
      </div>
    </div>
  )
}
