import { Percent } from 'lucide-react'
import { useApi } from '../hooks'
import { pageUrl } from '../config'
import { Loader, ErrorBox, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

export default function ProbabilityPage() {
  const { data, loading, error, reload } = useApi(pageUrl('probability'))
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const snapshots = data.snapshots || []

  return (
    <div className="space-y-6">
      <PageHeader title="Probability Snapshots" count={snapshots.length} onRefresh={reload} />
      <div className="space-y-2">
        {snapshots.map(s => (
          <div key={s.id} className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                {s.entity_ref && <p className="text-sm text-slate-200">{s.entity_ref}</p>}
                {s.event_type && <Badge text={s.event_type} variant="default" />}
              </div>
              <div className="text-right">
                {s.probability != null && (
                  <div className={`text-lg font-bold ${s.probability >= 0.7 ? 'text-emerald-400' : s.probability >= 0.4 ? 'text-amber-400' : 'text-red-400'}`}>
                    {(s.probability * 100).toFixed(0)}%
                  </div>
                )}
                <TimeAgo date={s.snapshot_time} />
              </div>
            </div>
          </div>
        ))}
        {snapshots.length === 0 && <EmptyState message="No probability snapshots yet" icon={Percent} />}
      </div>
    </div>
  )
}
