import { Cpu, CheckCircle } from 'lucide-react'
import { useApi } from '../hooks'
import { pageUrl } from '../config'
import { Loader, ErrorBox, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

export default function AgentHistoryPage() {
  const { data, loading, error, reload } = useApi(pageUrl('agent-history'))
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const runs = data.runs || []
  const actioned = data.actioned_decisions || []

  return (
    <div className="space-y-6">
      <PageHeader title="Agent History" onRefresh={reload} />

      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wider">Engine Runs ({runs.length})</h3>
        <div className="space-y-2">
          {runs.slice(0, 15).map(r => (
            <div key={r.id} className="bg-slate-800 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-slate-500" />
                <Badge text={r.status || 'â'} variant={r.status === 'completed' ? 'completed' : 'default'} />
                {r.engine_type && <span className="text-xs text-slate-400">{r.engine_type}</span>}
              </div>
              <TimeAgo date={r.started_at || r.run_timestamp} />
            </div>
          ))}
          {runs.length === 0 && <EmptyState message="No engine runs" icon={Cpu} />}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-slate-300 mb-3 uppercase tracking-wider">Actioned Decisions ({actioned.length})</h3>
        <div className="space-y-2">
          {actioned.slice(0, 15).map(d => (
            <div key={d.id} className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <Badge text={d.status} variant={d.status} />
                  </div>
                  <p className="text-sm text-slate-300">{d.title}</p>
                </div>
                <TimeAgo date={d.actioned_at} />
              </div>
            </div>
          ))}
          {actioned.length === 0 && <EmptyState message="No actioned decisions yet" icon={CheckCircle} />}
        </div>
      </div>
    </div>
  )
}
