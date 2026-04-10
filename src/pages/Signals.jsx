import { useState } from 'react'
import { Radio } from 'lucide-react'
import { useApi } from '../hooks'
import { pageUrl } from '../config'
import { Loader, ErrorBox, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

export default function SignalsPage() {
  const { data, loading, error, reload } = useApi(pageUrl('signals'))
  const [typeFilter, setTypeFilter] = useState('all')
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const all = data.signals || []
  const types = [...new Set(all.map(s => s.signal_type).filter(Boolean))]
  const filtered = typeFilter === 'all' ? all : all.filter(s => s.signal_type === typeFilter)

  return (
    <div className="space-y-6">
      <PageHeader title="Signals" count={all.length} onRefresh={reload} />
      {types.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setTypeFilter('all')} className={`px-3 py-1 rounded text-xs ${typeFilter === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>All</button>
          {types.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1 rounded text-xs ${typeFilter === t ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{t}</button>
          ))}
        </div>
      )}
      <div className="space-y-2">
        {filtered.map(s => (
          <div key={s.id} className="bg-slate-800 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge text={s.signal_type || 'unknown'} variant="default" />
                  <Badge text={s.source || 'â'} variant="default" />
                  {s.urgency_flag && <Badge text="urgent" variant="critical" />}
                </div>
                {s.raw_text && <p className="text-sm text-slate-300 truncate">{s.raw_text}</p>}
                {s.entity_ref && <p className="text-xs text-slate-500 mt-1">{s.entity_ref}</p>}
              </div>
              <TimeAgo date={s.signal_timestamp} />
            </div>
          </div>
        ))}
        {filtered.length === 0 && <EmptyState message="No signals found" icon={Radio} />}
      </div>
    </div>
  )
}
