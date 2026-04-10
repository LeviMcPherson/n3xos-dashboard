import { GitBranch } from 'lucide-react'
import { useApi } from '../hooks'
import { pageUrl } from '../config'
import { Loader, ErrorBox, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

export default function CascadesPage() {
  const { data, loading, error, reload } = useApi(pageUrl('cascades'))
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const cascades = data.cascades || []

  return (
    <div className="space-y-6">
      <PageHeader title="Cascade Chains" count={cascades.length} onRefresh={reload} />
      <div className="space-y-2">
        {cascades.map(c => (
          <div key={c.id} className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge text={c.status || 'active'} variant={c.status === 'resolved' ? 'resolved' : 'default'} />
              <TimeAgo date={c.created_at} />
            </div>
            {c.trigger_event && <p className="text-sm text-slate-300 mb-1">{c.trigger_event}</p>}
            {c.chain_description && <p className="text-xs text-slate-400">{c.chain_description}</p>}
            {c.affected_entities && Array.isArray(c.affected_entities) && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {c.affected_entities.map((e, i) => (
                  <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">{e}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {cascades.length === 0 && <EmptyState message="No cascade chains recorded" icon={GitBranch} />}
      </div>
    </div>
  )
}
