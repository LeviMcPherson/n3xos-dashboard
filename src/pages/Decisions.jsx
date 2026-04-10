import { useState } from 'react'
import { ListChecks } from 'lucide-react'
import { useApi } from '../hooks'
import { pageUrl } from '../config'
import { Loader, ErrorBox, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

export default function DecisionsPage() {
  const { data, loading, error, reload } = useApi(pageUrl('decisions'))
  const [filter, setFilter] = useState('all')
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const all = data.decisions || []
  const statuses = [...new Set(all.map(d => d.status).filter(Boolean))]
  const filtered = filter === 'all' ? all : all.filter(d => d.status === filter)

  return (
    <div className="space-y-6">
      <PageHeader title="Decision Queue" count={all.length} onRefresh={reload} />
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
        {filtered.map(d => (
          <div key={d.id} className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge text={d.urgency || 'â'} variant={d.urgency} />
                  <Badge text={d.status} variant={d.status} />
                </div>
                <p className="text-sm text-slate-200">{d.title}</p>
                {d.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{d.description}</p>}
              </div>
              <div className="text-right ml-4 shrink-0 space-y-1">
                {d.mrr_impact > 0 && <div className="text-sm text-amber-400 font-medium">${parseFloat(d.mrr_impact).toLocaleString()}</div>}
                {d.probability_score != null && <div className="text-xs text-slate-400">{(d.probability_score * 100).toFixed(0)}% probability</div>}
                {d.days_to_consequence != null && <div className="text-xs text-slate-500">{d.days_to_consequence} days to consequence</div>}
                <TimeAgo date={d.created_at} />
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState message="No decisions match this filter" icon={ListChecks} />}
      </div>
    </div>
  )
}
