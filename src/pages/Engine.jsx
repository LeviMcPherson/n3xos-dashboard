import { Cpu } from 'lucide-react'
import { useApi } from '../hooks'
import { pageUrl } from '../config'
import { Loader, ErrorBox, Badge, TimeAgo, EmptyState, PageHeader } from '../components/shared'

export default function EnginePage() {
  const { data, loading, error, reload } = useApi(pageUrl('engine'))
  if (loading) return <Loader />
  if (error) return <ErrorBox message={error} onRetry={reload} />
  const runs = data.runs || []

  return (
    <div className="space-y-6">
      <PageHeader title="Engine Runs" count={runs.length} onRefresh={reload} />
      <div className="space-y-2">
        {runs.map(r => (
          <div key={r.id} className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge text={r.engine_type || 'run'} variant="default" />
                <Badge text={r.status || 'â'} variant={r.status === 'completed' ? 'completed' : r.status === 'failed' ? 'failed' : 'default'} />
              </div>
              <div className="flex items-center gap-4">
                {r.input_signals_count != null && <span className="text-xs text-slate-400">{r.input_signals_count} signals in</span>}
                {r.output_decisions_count != null && <span className="text-xs text-cyan-400">{r.output_decisions_count} decisions out</span>}
                <TimeAgo date={r.started_at || r.run_timestamp} />
              </div>
            </div>
          </div>
        ))}
        {runs.length === 0 && <EmptyState message="No engine runs recorded" icon={Cpu} />}
      </div>
    </div>
  )
}
